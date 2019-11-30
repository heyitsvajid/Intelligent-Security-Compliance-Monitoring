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
import ElbComponent from './elbComponent';
import KmsComponent from './kmsComponent';

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
      s3: false,
      name: authUser ? authUser.name : "",
      authUser: authUser,
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
      rds:false,
      rdsAutomatedBackupChartData: [],
      rdsAutomatedBackupData: {},
      rdsAutomatedBackupHeader:[],    
      rdsDeletionProtectionChartData: [],
      rdsDeletionProtectionData: {},
      rdsDeletionProtectionHeader:[],                 
      rdsEncryptionChartData: [],
      rdsEncryptionData: {},
      rdsEncryptionHeader:[],                 
      rdsIAMAuthenticationChartData: [],
      rdsIAMAuthenticationData: {},
      rdsIAMAuthenticationHeader:[], 
      ec2:false,
      unusedAmisChartData: [],
      unusedAmisData: {},
      unusedAmisHeader:[],
      underutilizedInstancesChartData: [],
      underutilizedInstancesData: {},
      underutilizedInstancesHeader:[],
      unEncryptedAMISChartData: [],
      unEncryptedAMISData: {},
      unEncryptedAMISHeader:[],
      unrestrictedSecurityGroupAttachedEC2InstanceChartData: [],
      unrestrictedSecurityGroupAttachedEC2InstanceData: {},
      unrestrictedSecurityGroupAttachedEC2InstanceHeader:[],
      unAssociatedEIPsChartData: [],
      unAssociatedEIPsData: {},
      unAssociatedEIPsHeader:[],
      unusedEc2KeyPairsChartData: [],
      unusedEc2KeyPairsData: {},
      unusedEc2KeyPairsHeader:[],
      iam:false,
      keyRotationCheckChartData: [],
      keyRotationCheckData: {},
      keyRotationCheckHeader:[],
      unnecessaryAccessKeysChartData: [],
      unnecessaryAccessKeysData: {},
      unnecessaryAccessKeysHeader:[],
      iamUserswithAdminAccessChartData: [],
      iamUserswithAdminAccessData: {},
      iamUserswithAdminAccessHeader:[],
      iamUserswithPolicyEditAccessChartData: [],
      iamUserswithPolicyEditAccessData: {},
      iamUserswithPolicyEditAccessHeader:[],
      unusedIamUsersChartData: [],
      unusedIamUsersData: {},
      unusedIamUsersHeader:[],
      sshKeyRotationCheckChartData: [],
      sshKeyRotationCheckData: {},
      sshKeyRotationCheckHeader:[],


    };

    this.s3FullControlAccess()
    this.s3BucketEncryption()
    this.s3BucketMfaDelete()
    this.s3PublicAccess()
    this.s3BucketCustomerEncryption()
    this.s3LimitByIpAccess()    
    this.s3BucketLogging()
    this.rdsAutomatedBackup()
    this.rdsDeletionProtection()
    this.rdsEncryption()
    this.rdsIAMAuthentication()
    
    this.openService = this.openService.bind(this)
  }

  openService(id) {
    switch(id){
        case 1:
            this.setState({
                s3:!this.state.s3
            }) 
        break    
        case 2:
          this.setState({
              rds:!this.state.rds
          }) 
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

rdsIAMAuthentication() {
  API.rdsIAMAuthentication(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            rdsIAMAuthenticationChartData:chartData,
            rdsIAMAuthenticationData:tableData,
            rdsIAMAuthenticationHeader:header
          })
        })
      }
  })
}

rdsEncryption() {
  API.rdsEncryption(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            rdsEncryptionChartData:chartData,
            rdsEncryptionData:tableData,
            rdsEncryptionHeader:header
          })
        })
      }
  })
}

rdsDeletionProtection() {
  API.rdsDeletionProtection(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            rdsDeletionProtectionChartData:chartData,
            rdsDeletionProtectionData:tableData,
            rdsDeletionProtectionHeader:header
          })
        })
      }
  })
}

rdsAutomatedBackup() {
  API.rdsAutomatedBackup(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            rdsAutomatedBackupChartData:chartData,
            rdsAutomatedBackupData:tableData,
            rdsAutomatedBackupHeader:header
          })
        })
      }
  })
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

//ec2

unusedAmis() {
  API.unusedAmis(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unusedAmisChartData:chartData,
            unusedAmisData:tableData,
            unusedAmisHeader:header
          })
        })
      }
  })
}

underutilizedInstances() {
  API.underutilizedInstances(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            underutilizedInstancesChartData:chartData,
            underutilizedInstancesData:tableData,
            underutilizedInstancesHeader:header
          })
        })
      }
  })
}

unrestrictedSecurityGroupAttachedEC2Instance() {
  API.unrestrictedSecurityGroupAttachedEC2Instance(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unrestrictedSecurityGroupAttachedEC2InstanceChartData:chartData,
            unrestrictedSecurityGroupAttachedEC2InstanceData:tableData,
            unrestrictedSecurityGroupAttachedEC2InstanceHeader:header
          })
        })
      }
  })
}

unEncryptedAMIS() {
  API.unEncryptedAMIS(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unEncryptedAMISChartData:chartData,
            unEncryptedAMISData:tableData,
            unEncryptedAMISHeader:header
          })
        })
      }
  })
}

unAssociatedEIPs() {
  API.unAssociatedEIPs(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unAssociatedEIPsChartData:chartData,
            unAssociatedEIPsData:tableData,
            unAssociatedEIPsHeader:header
          })
        })
      }
  })
}

unusedEc2KeyPairs() {
  API.unusedEc2KeyPairs(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unusedEc2KeyPairsChartData:chartData,
            unusedEc2KeyPairsData:tableData,
            unusedEc2KeyPairsHeader:header
          })
        })
      }
  })
}

unAssociatedEIPsChartData() {
  API.unAssociatedEIPs(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unAssociatedEIPsChartData:chartData,
            unAssociatedEIPsData:tableData,
            unAssociatedEIPsChartHeader:header
          })
        })
      }
  })
}

keyRotationCheck() {
  API.keyRotationCheck(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            keyRotationCheckChartData:chartData,
            keyRotationCheckData:tableData,
            keyRotationCheckHeader:header
          })
        })
      }
  })
}

unnecessaryAccessKeys() {
  API.unnecessaryAccessKeys(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unnecessaryAccessKeysChartData:chartData,
            unnecessaryAccessKeysData:tableData,
            unnecessaryAccessKeysHeader:header
          })
        })
      }
  })
}

iamUserswithAdminAccess() {
  API.iamUserswithAdminAccess(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            iamUserswithAdminAccessChartData:chartData,
            iamUserswithAdminAccessData:tableData,
            iamUserswithAdminAccessHeader:header
          })
        })
      }
  })
}

unusedIamUsers() {
  API.unusedIamUsers(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            unusedIamUsersChartData:chartData,
            unusedIamUsersData:tableData,
            unusedIamUsersHeader:header
          })
        })
      }
  })
}

sshKeyRotation() {
  API.sshKeyRotation(this.state.authUser, (err, response) => {
      if(err){
          console.log("Error fetching rdsAutomatedBackup")
      }else{
        this.getDataFromResponse(response, (header, tableData, chartData) => {
          this.setState({
            sshKeyRotationCheckChartData:chartData,
            sshKeyRotationCheckData:tableData,
            sshKeyRotationCheckHeader:header
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
                              <ElbComponent/>
                          </Tab>
                          <Tab title="IAM" eventKey="iam">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="KMS" eventKey="kms">
                              <KmsComponent/>
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