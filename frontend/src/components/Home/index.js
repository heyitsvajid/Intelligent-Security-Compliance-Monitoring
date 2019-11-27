import React from 'react';
import { compose } from 'recompose';
import Rule from '../Rule/Rule'
import API from '../API/index'
import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import Fade from 'react-reveal/Fade';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusSquare,
    faMinusSquare
  } from "@fortawesome/free-regular-svg-icons";
import {Tabs, Tab} from 'react-bootstrap';
import CloudTrailComponent from "./cloudTrailComponent";

const STATUS_PASSED = "PASS"
const STATUS_FAILED = "FAIL"

const HomePage = (match) => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <div className="mt-4">
          <ComplainceReport authUser={authUser}/>
        </div>
      ) : (
          ""
        )
    }
  </AuthUserContext.Consumer>
  );

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);



class ComplainceReport extends React.Component {

  constructor(props) {
    super(props);
    let authUser = this.props.authUser

    this.state = {
      "s3": false,
      "name": authUser ? authUser.name : "",
      "authUser": authUser,
      s3FullControlAccessChartData: [],
      s3FullControlAccessData: {},
      s3FullControlAccessHeader:[], 
      s3BucketEncryptionChartData: [],
      s3BucketEncryptionData: {},
      s3BucketEncryptionHeader:[]
    };

    this.s3FullControlAccess(authUser)
    this.s3BucketEncryption(authUser)
    this.s3FullControlAccess = this.s3FullControlAccess.bind(this)
    this.openService = this.openService.bind(this)
  }

  openService(id) {
    switch(id){
        case 1:
            this.setState({
                s3:!this.state.s3
            }) 
        break    
    }
}

getDataFromResponse(response, callback){
  let passed = response.passed
  let failed = response.failed
  let passedCount = passed.length;
  let failedCount = failed.length 
  let header = ["Resource Name", "Status"]
  let tableData = []
  for(let i = 0; i<passed.length; i++){
    let bucketData = [];  
    bucketData.push(passed[i])        
    bucketData.push(STATUS_PASSED)        
    tableData.push(bucketData);
  }
  for(let i = 0; i<failed.length; i++){
    let bucketData = [];  
    bucketData.push(failed[i])        
    bucketData.push(STATUS_FAILED)        
    tableData.push(bucketData);
  }
  let chartData = [{ name: 'Buckets', passed: passedCount, failed: failedCount}]
  callback(header, tableData, chartData)
}

s3FullControlAccess() {
  API.s3FullControlAccess(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3FullControlAccess")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3FullControlAccessChartData:chartData,
            s3FullControlAccessData:tableData,
            s3FullControlAccessHeader:header
          })
        })
      }
  })
}

s3BucketEncryption() {
  API.s3BucketEncryption(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3BucketEncryption")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3BucketEncryptionChartData:chartData,
            s3BucketEncryptionData:tableData,
            s3BucketEncryptionHeader:header
          })
        })
      }
  })
}

  render = () => {
    return (
              <Container fluid className="p-0">
              <Row className="mt-3">
              <Col md="1"/>
                <Col md="10">
                <Card>
                    <CardHeader>
                    <Row className="mt-3">
                      <Col style = {{textAlign: 'center'}}> 
                          <h1 style = {{color: '#2698da '}}>Compliance Report</h1> 
                      </Col>
                      </Row>
                    </CardHeader>
                  <CardBody>
                      {/*<div>*/}
                      {/*<Row onClick={this.openService.bind(this,1)}>*/}
                      {/*    <Col md="11"><h4><b>Simple Storage Service (S3)</b></h4></Col>*/}
                      {/*    <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3 ? faMinusSquare: faPlusSquare}/></Col>*/}
                      {/*</Row>*/}
                      {/*<Fade>*/}
                      {/*<div  id="s3FullControlAccess" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>*/}
                      {/*{*/}
                      {/*      this.state.s3FullControlAccessData.length > 0 ?*/}
                      {/*      <Rule chartData={this.state.s3FullControlAccessChartData}*/}
                      {/*      tableHeaders={this.state.s3FullControlAccessHeader}*/}
                      {/*      tableTitle={"S3 Full Control Access"}*/}
                      {/*      tableData={this.state.s3FullControlAccessData} />*/}
                      {/*      : "Service not in use."*/}
                      {/*}*/}
                      {/*</div>*/}
                      {/*<div  id="s3BucketEncryption" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>*/}
                      {/*{*/}
                      {/*      this.state.s3BucketEncryptionData.length > 0 ?*/}
                      {/*      <Rule chartData={this.state.s3BucketEncryptionChartData}*/}
                      {/*      tableHeaders={this.state.s3BucketEncryptionHeader}*/}
                      {/*      tableTitle={"S3 Bucket Encryption"}*/}
                      {/*      tableData={this.state.s3BucketEncryptionData} />*/}
                      {/*      : "Service not in use."*/}
                      {/*}*/}
                      {/*</div>*/}
                      {/*</Fade>*/}
                      {/*<hr/>*/}
                      {/*</div>*/}
                      <Tabs id="tabView" defaultActiveKey="autoScaling">
                          <Tab title="Auto Scaling" eventKey="autoScaling">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="Cloud Trail" eventKey="cloudTrail">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="EC2" eventKey="ec2">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="ELB" eventKey="elb">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="IAM" eventKey="iam">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="KMS" eventKey="kms">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="RDS" eventKey="rds">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="S3" eventKey="s3">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="VPC" eventKey="vpc">
                              <CloudTrailComponent/>
                          </Tab>
                      </Tabs>
                  </CardBody>
                </Card>
                </Col>
                <Col md="1"/>
              </Row>
            </Container>
    );
  }
}