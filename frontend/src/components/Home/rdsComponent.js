import React from 'react';
import Rule from '../Rule/Rule';
import API from '../API/index'
import Fade from 'react-reveal/Fade';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusSquare,
    faMinusSquare
} from "@fortawesome/free-regular-svg-icons";

const STATUS_PASSED = "PASS";
const STATUS_FAILED = "FAIL";

class RDSComponent extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
        rdsAutomatedBackup: false,
        rdsDeletionProtection: false,
        rdsEncryption: false,
        rdsIAMAuthentication: false,
        name: authUser ? authUser.name : "",
      authUser: authUser,
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
        };

        this.rdsAutomatedBackup()
        this.rdsDeletionProtection()
        this.rdsEncryption()
        this.rdsIAMAuthentication()
        this.openService = this.openService.bind(this)

        }

    openService(id) {
        switch (id) {
            case "rdsAutomatedBackup":
                this.setState({
                    rdsAutomatedBackup: !this.state.rdsAutomatedBackup
                });
                break;
            case "rdsDeletionProtection":
                this.setState({
                    rdsDeletionProtection: !this.state.rdsDeletionProtection
                });
                break;
            case "rdsEncryption":
                this.setState({
                    rdsEncryption: !this.state.rdsEncryption
                });
                break;
            case "rdsIAMAuthentication":
                this.setState({
                    rdsIAMAuthentication: !this.state.rdsIAMAuthentication
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
            let rdsData = [];
            rdsData.push(passed[i]);
            rdsData.push(STATUS_PASSED);
            tableData.push(rdsData);
        }
        for(let i = 0; i<failed.length; i++){
            let rdsData = [];
            rdsData.push(failed[i]);
            rdsData.push(STATUS_FAILED);
            tableData.push(rdsData);
        }
        let chartData = [{ name: 'RDS Instances', passed: passedCount, failed: failedCount}];
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

    render = () => {
        return(
            <div id="RDSComponent">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Relational Database Service (RDS)</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"rdsAutomatedBackup")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>RDS Automated Backup</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unusedAmis ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="rdsAutomatedBackup" className="mt-3" style={{display: this.state.rdsAutomatedBackup ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.rdsAutomatedBackupData.length > 0 ?
                                        <Rule chartData={this.state.rdsAutomatedBackupChartData}
                                              tableHeaders={this.state.rdsAutomatedBackupHeader}
                                              tableTitle={"Access Logging for Cloud Trail Buckets"}
                                              tableData={this.state.rdsAutomatedBackupData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"rdsDeletionProtection")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>RDS Deletion Protection</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.rdsDeletionProtection ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="rdsDeletionProtection" className="mt-3" style={{display: this.state.rdsDeletionProtection ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.rdsDeletionProtectionData.length > 0 ?
                                        <Rule chartData={this.state.rdsDeletionProtectionChartData}
                                              tableHeaders={this.state.rdsDeletionProtectionHeader}
                                              tableTitle={"MFA Delete for Cloud Trail Buckets"}
                                              tableData={this.state.rdsDeletionProtectionData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"rdsEncryption")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>RDS Encryption</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.rdsEncryption ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unEncryptedAMIS" className="mt-3" style={{display: this.state.rdsEncryption ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.rdsEncryptionData.length > 0 ?
                                        <Rule chartData={this.state.rdsEncryptionChartData}
                                              tableHeaders={this.state.rdsEncryptionHeader}
                                              tableTitle={"Insecure Buckets for Cloud Trail"}
                                              tableData={this.state.rdsEncryptionData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"rdsIAMAuthentication")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>RDS IAM Authentication</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.rdsIAMAuthentication ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="rdsIAMAuthentication" className="mt-3" style={{display: this.state.rdsIAMAuthentication ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.rdsIAMAuthenticationData.length > 0 ?
                                        <Rule chartData={this.state.rdsIAMAuthenticationChartData}
                                              tableHeaders={this.state.rdsIAMAuthenticationHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.rdsIAMAuthenticationData} />
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

export default RDSComponent;