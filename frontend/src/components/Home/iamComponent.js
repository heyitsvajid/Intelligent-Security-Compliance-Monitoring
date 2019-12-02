import React from 'react';
import Rule from '../Rule/Rule';
import IamApi from '../API/iamApi';
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

const STATUS_PASSED = "PASS";
const STATUS_FAILED = "FAIL";

class IamComponent extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
            name: authUser ? authUser.name : "",
      authUser: authUser,
      keyRotationCheck:false,
      unnecessaryAccessKeys:false,
      iamUserswithAdminAccess:false,
      iamUserswithPolicyEditAccess:false,
      unusedIamUsers:false,
      sshKeyRotationCheck:false,
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

        this.keyRotationCheck(authUser);
        this.unnecessaryAccessKeys(authUser);
        this.iamUserswithAdminAccess(authUser);
        this.unusedIamUsers(authUser);
        this.sshKeyRotationCheck(authUser);
        this.iamUserswithPolicyEditAccess(authUser);
        this.openService = this.openService.bind(this);
    }

    openService(id) {
        switch (id) {
            case "keyRotationCheck":
                this.setState({
                    keyRotationCheck: !this.state.keyRotationCheck
                });
                break;
            case "unnecessaryAccessKeys":
                this.setState({
                    unnecessaryAccessKeys: !this.state.unnecessaryAccessKeys
                });
                break;
            case "iamUserswithAdminAccess":
                this.setState({
                    iamUserswithAdminAccess: !this.state.iamUserswithAdminAccess
                });
                break;
            case "iamUserswithPolicyEditAccess":
                this.setState({
                    iamUserswithPolicyEditAccess: !this.state.iamUserswithPolicyEditAccess
                });
                break;
            case "unusedIamUsers":
                this.setState({
                    unusedIamUsers: !this.state.unusedIamUsers
                });
                break;
            case "sshKeyRotationCheck":
                this.setState({
                    sshKeyRotationCheck: !this.state.sshKeyRotationCheck
                });
                break;
            default:
                break;
        }
    }

    getDataFromResponse(response, callback){
        let passed = response.passed;
        let failed = response.failed;
        let passedCount = passed.length;
        let failedCount = failed.length;
        let header = ["Resource Name", "Status"];
        let tableData = [];
        for(let i = 0; i<passed.length; i++){
            let trailData = [];
            trailData.push(passed[i]);
            trailData.push(STATUS_PASSED);
            tableData.push(trailData);
        }
        for(let i = 0; i<failed.length; i++){
            let trailData = [];
            trailData.push(failed[i]);
            trailData.push(STATUS_FAILED);
            tableData.push(trailData);
        }
        let chartData = [{ name: 'Trails', passed: passedCount, failed: failedCount}];
        callback(header, tableData, chartData)
    }

    keyRotationCheck() {
        IamApi.keyRotationCheck(this.state.authUser, (err, response) => {
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
        IamApi.unnecessaryAccessKeys(this.state.authUser, (err, response) => {
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
        IamApi.iamUserswithAdminAccess(this.state.authUser, (err, response) => {
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
        IamApi.unusedIamUsers(this.state.authUser, (err, response) => {
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
      
      sshKeyRotationCheck() {
        IamApi.sshKeyRotationCheck(this.state.authUser, (err, response) => {
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
      iamUserswithPolicyEditAccess() {
        IamApi.iamUserswithPolicyEditAccess(this.state.authUser, (err, response) => {
            if(err){
                console.log("Error fetching rdsAutomatedBackup")
            }else{
              this.getDataFromResponse(response, (header, tableData, chartData) => {
                this.setState({
                    iamUserswithPolicyEditAccessChartData:chartData,
                  iamUserswithPolicyEditAccessData:tableData,
                  iamUserswithPolicyEditAccessHeader:header
                })
              })
            }
        })
      }
    render = () => {
        return(
            <div id="IamComponent">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Cloud Trail Service</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"keyRotationCheck")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Key Rotation Check</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.keyRotationCheck ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="keyRotationCheck" className="mt-3" style={{display: this.state.keyRotationCheck ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.keyRotationCheckData.length > 0 ?
                                        <Rule chartData={this.state.keyRotationCheckChartData}
                                              tableHeaders={this.state.keyRotationCheckHeader}
                                              tableTitle={"Access Logging for Cloud Trail Buckets"}
                                              tableData={this.state.keyRotationCheckData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"unnecessaryAccessKeys")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Unnecessary Access Keys</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unnecessaryAccessKeys ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unnecessaryAccessKeys" className="mt-3" style={{display: this.state.unnecessaryAccessKeys ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unnecessaryAccessKeysData.length > 0 ?
                                        <Rule chartData={this.state.unnecessaryAccessKeysChartData}
                                              tableHeaders={this.state.unnecessaryAccessKeysHeader}
                                              tableTitle={"MFA Delete for Cloud Trail Buckets"}
                                              tableData={this.state.unnecessaryAccessKeysData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"iamUserswithAdminAccess")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Iam Users with Admin Access</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.iamUserswithAdminAccess ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="iamUserswithAdminAccess" className="mt-3" style={{display: this.state.iamUserswithAdminAccess ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.iamUserswithAdminAccessData.length > 0 ?
                                        <Rule chartData={this.state.iamUserswithAdminAccessChartData}
                                              tableHeaders={this.state.iamUserswithAdminAccessHeader}
                                              tableTitle={"Insecure Buckets for Cloud Trail"}
                                              tableData={this.state.iamUserswithAdminAccessData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"iamUserswithPolicyEditAccess")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Iam Users with Policy Edit Access</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.iamUserswithPolicyEditAccess ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="iamUserswithPolicyEditAccess" className="mt-3" style={{display: this.state.iamUserswithPolicyEditAccess ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.iamUserswithPolicyEditAccessData.length > 0 ?
                                        <Rule chartData={this.state.iamUserswithPolicyEditAccessChartData}
                                              tableHeaders={this.state.iamUserswithPolicyEditAccessHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.iamUserswithPolicyEditAccessData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"unusedIamUsers")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Unused Iam Users</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unusedIamUsers ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unusedIamUsers" className="mt-3" style={{display: this.state.unusedIamUsers ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unusedIamUsersData.length > 0 ?
                                        <Rule chartData={this.state.unusedIamUsersChartData}
                                              tableHeaders={this.state.unusedIamUsersHeader}
                                              tableTitle={"Multi Region Access for Cloud Trails"}
                                              tableData={this.state.unusedIamUsersData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"sshKeyRotationCheck")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Ssh Key Rotation Check</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.sshKeyRotationCheck ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="sshKeyRotationCheck" className="mt-3" style={{display: this.state.sshKeyRotationCheck ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.sshKeyRotationCheckData.length > 0 ?
                                        <Rule chartData={this.state.sshKeyRotationCheckChartData}
                                              tableHeaders={this.state.sshKeyRotationCheckHeader}
                                              tableTitle={"Log File Integrity Validation for Cloud Trails"}
                                              tableData={this.state.sshKeyRotationCheckData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>
                    </CardBody>
                </Card>
            </div>
        );
    }

}

export default IamComponent;