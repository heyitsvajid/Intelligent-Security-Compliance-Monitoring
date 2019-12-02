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

class S3Component extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
            s3FullControlAccess:false,
            s3BucketEncryption:false,
            s3BucketMfaDelete:false,
            s3PublicAccess:false,
            s3BucketCustomerEncryption:false,
            s3LimitByIpAccess:false,
            s3BucketLogging:false,
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
      s3BucketLoggingHeader:[]               
        };

        this.s3FullControlAccess(authUser)
        this.s3BucketEncryption(authUser)
        this.s3BucketMfaDelete(authUser)
        this.s3PublicAccess(authUser)
        this.s3BucketCustomerEncryption(authUser)
        this.s3LimitByIpAccess(authUser)    
        this.s3BucketLogging(authUser)
        this.openService = this.openService.bind(this)
        }

    openService(id) {
        switch (id) {
            case "s3FullControlAccess":
                this.setState({
                    s3FullControlAccess: !this.state.s3FullControlAccess
                });
                break;
            case "s3BucketEncryption":
                this.setState({
                    s3BucketEncryption: !this.state.s3BucketEncryption
                });
                break;
            case "s3BucketMfaDelete":
                this.setState({
                    s3BucketMfaDelete: !this.state.s3BucketMfaDelete
                });
                break;
            case "s3PublicAccess":
                this.setState({
                    s3PublicAccess: !this.state.s3PublicAccess
                });
                break;
                case "s3BucketCustomerEncryption":
                    this.setState({
                        s3BucketCustomerEncryption: !this.state.s3BucketCustomerEncryption
                    });
                    break;
                    case "s3LimitByIpAccess":
                        this.setState({
                            s3LimitByIpAccess: !this.state.s3LimitByIpAccess
                        });
                        break;
                        case "s3BucketLogging":
                            this.setState({
                                s3BucketLogging: !this.state.s3BucketLogging
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
            let s3Data = [];
            s3Data.push(passed[i]);
            s3Data.push(STATUS_PASSED);
            tableData.push(s3Data);
        }
        for(let i = 0; i<failed.length; i++){
            let s3Data = [];
            s3Data.push(failed[i]);
            s3Data.push(STATUS_FAILED);
            tableData.push(s3Data);
        }
        let chartData = [{ name: 'S3 Buckets', passed: passedCount, failed: failedCount}];
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
        return(
            <div id="S3Component">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Simple Storage Service (Amazon S3)</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"s3FullControlAccess")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Full Control Access</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3FullControlAccess ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3FullControlAccess" className="mt-3" style={{display: this.state.s3FullControlAccess ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3FullControlAccessData.length > 0 ?
                                        <Rule chartData={this.state.s3FullControlAccessChartData}
                                              tableHeaders={this.state.s3FullControlAccessHeader}
                                              tableTitle={"Access Logging for Cloud Trail Buckets"}
                                              tableData={this.state.s3FullControlAccessData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"s3BucketEncryption")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Bucket Encryption</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3BucketEncryption ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3BucketEncryption" className="mt-3" style={{display: this.state.s3BucketEncryption ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3BucketEncryptionData.length > 0 ?
                                        <Rule chartData={this.state.s3BucketEncryptionChartData}
                                              tableHeaders={this.state.s3BucketEncryptionHeader}
                                              tableTitle={"MFA Delete for Cloud Trail Buckets"}
                                              tableData={this.state.s3BucketEncryptionData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"s3BucketMfaDelete")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Bucket Mfa Delete</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3BucketMfaDelete ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3BucketMfaDelete" className="mt-3" style={{display: this.state.s3BucketMfaDelete ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3BucketMfaDeleteData.length > 0 ?
                                        <Rule chartData={this.state.s3BucketMfaDeleteChartData}
                                              tableHeaders={this.state.s3BucketMfaDeleteHeader}
                                              tableTitle={"Insecure Buckets for Cloud Trail"}
                                              tableData={this.state.s3BucketMfaDeleteData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"s3BucketLogging")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Bucket Logging</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3BucketLogging ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3BucketLogging" className="mt-3" style={{display: this.state.s3BucketLogging ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3BucketLoggingData.length > 0 ?
                                        <Rule chartData={this.state.s3BucketLoggingChartData}
                                              tableHeaders={this.state.s3BucketLoggingHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.s3BucketLoggingData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>
                        <Row onClick={this.openService.bind(this,"s3BucketCustomerEncryption")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Bucket Customer Encryption</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3BucketCustomerEncryption ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3BucketCustomerEncryption" className="mt-3" style={{display: this.state.s3BucketCustomerEncryption ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3BucketCustomerEncryptionData.length > 0 ?
                                        <Rule chartData={this.state.s3BucketCustomerEncryptionChartData}
                                              tableHeaders={this.state.s3BucketCustomerEncryptionHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.s3BucketCustomerEncryptionData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>
                        <Row onClick={this.openService.bind(this,"s3LimitByIpAccess")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Limit By Ip Access</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3LimitByIpAccess ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3LimitByIpAccess" className="mt-3" style={{display: this.state.s3LimitByIpAccess ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3PublicAccessData.length > 0 ?
                                        <Rule chartData={this.state.s3PublicAccessChartData}
                                              tableHeaders={this.state.s3PublicAccessHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.s3PublicAccessData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>
                        <Row onClick={this.openService.bind(this,"s3PublicAccess")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>S3 Public Access</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3PublicAccess ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="s3PublicAccess" className="mt-3" style={{display: this.state.s3PublicAccess ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.s3PublicAccessData.length > 0 ?
                                        <Rule chartData={this.state.s3PublicAccessChartData}
                                              tableHeaders={this.state.s3PublicAccessHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.s3PublicAccessData} />
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

export default S3Component;