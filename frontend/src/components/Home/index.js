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
      s3BucketEncryptionHeader:[],
      s3BucketMfaDeleteChartData: [],
      s3BucketMfaDeleteData: {},
      s3BucketMfaDeleteHeader:[],
      s3PublicAccessChartData: [],
      s3PublicAccessData: {},
      s3PublicAccessHeader:[],
      s3BucketCustomerEncryptionChartData: [],
      s3BucketCustomerEncryptionData: {},
      s3BucketCustomerEncryptionHeader:[],
      s3LimitByIpAccessChartData: [],
      s3LimitByIpAccessData: {},
      s3LimitByIpAccessHeader:[],  
      s3BucketLoggingChartData: [],
      s3BucketLoggingData: {},
      s3BucketLoggingHeader:[],           
    };

    this.s3FullControlAccess()
    this.s3BucketEncryption()
    this.s3BucketMfaDelete()
    this.s3PublicAccess()
    this.s3BucketCustomerEncryption()
    this.s3LimitByIpAccess()    
    this.s3BucketLogging()
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

s3BucketMfaDelete() {
  API.s3BucketMfaDelete(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3BucketEncryption")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3BucketMfaDeleteChartData:chartData,
            s3BucketMfaDeleteData:tableData,
            s3BucketMfaDeleteHeader:header
          })
        })
      }
  })
}

s3PublicAccess() {
  API.s3PublicAccess(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3PublicAccess")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3PublicAccessChartData:chartData,
            s3PublicAccessData:tableData,
            s3PublicAccessHeader:header
          })
        })
      }
  })
}

s3BucketCustomerEncryption() {
  API.s3BucketCustomerEncryption(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3BucketCustomerEncryption")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3BucketCustomerEncryptionChartData:chartData,
            s3BucketCustomerEncryptionData:tableData,
            s3BucketCustomerEncryptionHeader:header
          })
        })
      }
  })
}

s3LimitByIpAccess() {
  API.s3LimitByIpAccess(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3BucketCustomerEncryption")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3LimitByIpAccessChartData:chartData,
            s3LimitByIpAccessData:tableData,
            s3LimitByIpAccessHeader:header
          })
        })
      }
  })
}

s3BucketLogging() {
  API.s3BucketLogging(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching s3BucketLogging")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            s3BucketLoggingChartData:chartData,
            s3BucketLoggingData:tableData,
            s3BucketLoggingHeader:header
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
                  <div>
                  <Row onClick={this.openService.bind(this,1)}>
                      <Col md="11"><h4><b>Simple Storage Service (S3)</b></h4></Col>
                      <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3 ? faMinusSquare: faPlusSquare}/></Col>
                  </Row>
                  <Fade>
                  <div  id="s3FullControlAccess" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3FullControlAccessData.length > 0 ?
                        <Rule chartData={this.state.s3FullControlAccessChartData} 
                        tableHeaders={this.state.s3FullControlAccessHeader}
                        tableTitle={"S3 Full Control Access"} 
                        tableData={this.state.s3FullControlAccessData} /> 
                        : "No data available for rule."
                  }
                  </div>
                  <div  id="s3BucketEncryption" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3BucketEncryptionData.length > 0 ?
                        <Rule chartData={this.state.s3BucketEncryptionChartData} 
                        tableHeaders={this.state.s3BucketEncryptionHeader}
                        tableTitle={"S3 Bucket Encryption"} 
                        tableData={this.state.s3BucketEncryptionData} /> 
                        : "No data available for rule."
                  }
                  </div>
                  <div  id="s3BucketMfaDelete" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3BucketMfaDeleteData.length > 0 ?
                        <Rule chartData={this.state.s3BucketMfaDeleteChartData} 
                        tableHeaders={this.state.s3BucketMfaDeleteHeader}
                        tableTitle={"S3 Bucket Mfa Delete"} 
                        tableData={this.state.s3BucketMfaDeleteData} /> 
                        : "No data available for rule."
                  }
                  </div>
                  <div  id="s3PublicAccess" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3PublicAccessData.length > 0 ?
                        <Rule chartData={this.state.s3PublicAccessChartData} 
                        tableHeaders={this.state.s3PublicAccessHeader}
                        tableTitle={"S3 Public Access"} 
                        tableData={this.state.s3PublicAccessData} /> 
                        : "No data available for rule."
                  }
                  </div>
                  <div  id="s3BucketCustomerEncryption" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3BucketCustomerEncryptionData.length > 0 ?
                        <Rule chartData={this.state.s3BucketCustomerEncryptionChartData} 
                        tableHeaders={this.state.s3BucketCustomerEncryptionHeader}
                        tableTitle={"S3 Bucket Customer Encryption"} 
                        tableData={this.state.s3BucketCustomerEncryptionData} /> 
                        : "No data available for rule."
                  }
                  </div>
                  <div  id="s3LimitByIpAccess" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3LimitByIpAccessData.length > 0 ?
                        <Rule chartData={this.state.s3LimitByIpAccessChartData} 
                        tableHeaders={this.state.s3LimitByIpAccessHeader}
                        tableTitle={"S3 Limit By Ip Access"} 
                        tableData={this.state.s3LimitByIpAccessData} /> 
                        : "No data available for rule."
                  }
                  </div>         
                  <div  id="s3BucketLogging" className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                  {
                        this.state.s3BucketLoggingData.length > 0 ?
                        <Rule chartData={this.state.s3BucketLoggingChartData} 
                        tableHeaders={this.state.s3BucketLoggingHeader}
                        tableTitle={"S3 Bucket Logging"} 
                        tableData={this.state.s3BucketLoggingData} /> 
                        : "No data available for rule."
                  }
                  </div>                  
                  
                  </Fade>
                  <hr/>
                  </div>         
          </CardBody>
        </Card>
                  </Col>
                <Col md="1"/>
              </Row>
            </Container>
    );
  }
}