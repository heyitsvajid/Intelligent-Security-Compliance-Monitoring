import React from 'react';
import Rule from '../Rule/Rule';
import CloudTrailApi from '../API/cloudTrailApi';
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

class CloudTrailComponent extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
            accessLogging: false,
            mfaDelete: false,
            insecureBuckets: false,
            logFileEncryption: false,
            multiRegion: false,
            logFileIntegrityValidation: false,
            name: authUser ? authUser.name : "",
            authUser: authUser,
            accessLoggingChartData: [],
            accessLoggingData: {},
            accessLoggingHeader: [],
            mfaDeleteChartData: [],
            mfaDeleteData: {},
            mfaDeleteHeader: [],
            insecureBucketsChartData: [],
            insecureBucketsData: {},
            insecureBucketsHeader: [],
            logFileEncryptionChartData: [],
            logFileEncryptionData: {},
            logFileEncryptionHeader: [],
            multiRegionChartData: [],
            multiRegionData: {},
            multiRegionHeader: [],
            logFileIntegrityValidationChartData: [],
            logFileIntegrityValidationData: {},
            logFileIntegrityValidationHeader: []
        };

        this.checkAccessLoggingForBuckets(authUser);
        this.checkMfaDeleteForBuckets(authUser);
        this.checkInsecureBuckets(authUser);
        this.checkLogFileEncryption(authUser);
        this.checkMultiRegionAccess(authUser);
        this.checkLogFileIntegrityValidation(authUser);
        this.openService = this.openService.bind(this);
    }

    openService(id) {
        switch (id) {
            case "accessLogging":
                this.setState({
                    accessLogging: !this.state.accessLogging
                });
                break;
            case "mfaDelete":
                this.setState({
                    mfaDelete: !this.state.mfaDelete
                });
                break;
            case "insecureBuckets":
                this.setState({
                    insecureBuckets: !this.state.insecureBuckets
                });
                break;
            case "logFileEncryption":
                this.setState({
                    logFileEncryption: !this.state.logFileEncryption
                });
                break;
            case "multiRegion":
                this.setState({
                    multiRegion: !this.state.multiRegion
                });
                break;
            case "logFileIntegrityValidation":
                this.setState({
                    logFileIntegrityValidation: !this.state.logFileIntegrityValidation
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

    checkAccessLoggingForBuckets() {
        CloudTrailApi.checkAccessLoggingForBuckets(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Access Logging Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        accessLoggingChartData: chartData,
                        accessLoggingData: tableData,
                        accessLoggingHeader: header
                    })
                })
            }
        })
    }

    checkMfaDeleteForBuckets() {
        CloudTrailApi.checkMfaDeleteForBuckets(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching MFA Delete Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        mfaDeleteChartData: chartData,
                        mfaDeleteData: tableData,
                        mfaDeleteHeader: header
                    })
                })
            }
        })
    }

    checkInsecureBuckets() {
        CloudTrailApi.checkInsecureBuckets(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Insecure Buckets Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        insecureBucketsChartData: chartData,
                        insecureBucketsData: tableData,
                        insecureBucketsHeader: header
                    })
                })
            }
        })
    }

    checkLogFileEncryption() {
        CloudTrailApi.checkLogFileEncryption(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Log File Encryption Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        logFileEncryptionChartData: chartData,
                        logFileEncryptionData: tableData,
                        logFileEncryptionHeader: header
                    })
                })
            }
        })
    }

    checkMultiRegionAccess() {
        CloudTrailApi.checkMultiRegionAccess(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Multi Region Access Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        multiRegionChartData: chartData,
                        multiRegionData: tableData,
                        multiRegionHeader: header
                    })
                })
            }
        })
    }

    checkLogFileIntegrityValidation() {
        CloudTrailApi.checkLogFileIntegrityValidation(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Log File Integrity Validation Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        logFileIntegrityValidationChartData: chartData,
                        logFileIntegrityValidationData: tableData,
                        logFileIntegrityValidationHeader: header
                    })
                })
            }
        })
    }

    render = () => {
        return(
            <div id="cloudTrailComponent">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Cloud Trail Service</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"accessLogging")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Access Logging for Cloud Trail Buckets</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.accessLogging ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="accessLogging" className="mt-3" style={{display: this.state.accessLogging ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.accessLoggingData.length > 0 ?
                                        <Rule chartData={this.state.accessLoggingChartData}
                                              tableHeaders={this.state.accessLoggingHeader}
                                              tableTitle={"Access Logging for Cloud Trail Buckets"}
                                              tableData={this.state.accessLoggingData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"mfaDelete")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>MFA Delete for Cloud Trail Buckets</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.mfaDelete ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="mfaDelete" className="mt-3" style={{display: this.state.mfaDelete ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.mfaDeleteData.length > 0 ?
                                        <Rule chartData={this.state.mfaDeleteChartData}
                                              tableHeaders={this.state.mfaDeleteHeader}
                                              tableTitle={"MFA Delete for Cloud Trail Buckets"}
                                              tableData={this.state.mfaDeleteData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"insecureBuckets")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Insecure Buckets for Cloud Trail</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.insecureBuckets ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="insecureBuckets" className="mt-3" style={{display: this.state.insecureBuckets ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.insecureBucketsData.length > 0 ?
                                        <Rule chartData={this.state.insecureBucketsChartData}
                                              tableHeaders={this.state.insecureBucketsHeader}
                                              tableTitle={"Insecure Buckets for Cloud Trail"}
                                              tableData={this.state.insecureBucketsData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"logFileEncryption")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Log File Encryption for Cloud Trail Buckets</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.logFileEncryption ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="logFileEncryption" className="mt-3" style={{display: this.state.logFileEncryption ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.logFileEncryptionData.length > 0 ?
                                        <Rule chartData={this.state.logFileEncryptionChartData}
                                              tableHeaders={this.state.logFileEncryptionHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.logFileEncryptionData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"multiRegion")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Multi Region Access for Cloud Trails</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.multiRegion ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="multiRegion" className="mt-3" style={{display: this.state.multiRegion ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.multiRegionData.length > 0 ?
                                        <Rule chartData={this.state.multiRegionChartData}
                                              tableHeaders={this.state.multiRegionHeader}
                                              tableTitle={"Multi Region Access for Cloud Trails"}
                                              tableData={this.state.multiRegionData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"logFileIntegrityValidation")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Log File Integrity Validation for Cloud Trails</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.logFileIntegrityValidation ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="logFileIntegrityValidation" className="mt-3" style={{display: this.state.logFileIntegrityValidation ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.logFileIntegrityValidationData.length > 0 ?
                                        <Rule chartData={this.state.logFileIntegrityValidationChartData}
                                              tableHeaders={this.state.logFileIntegrityValidationHeader}
                                              tableTitle={"Log File Integrity Validation for Cloud Trails"}
                                              tableData={this.state.logFileIntegrityValidationData} />
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

export default CloudTrailComponent;