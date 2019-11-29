import React from 'react';
import Rule from '../Rule/Rule';
import KmsApi from '../API/kmsApi';
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

class KmsComponent extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
            exposedKeys: false,
            crossAccountAccess: false,
            name: authUser ? authUser.name : "",
            authUser: authUser,
            exposedKeysChartData: [],
            exposedKeysData: {},
            exposedKeysHeader: [],
            crossAccountAccessChartData: [],
            crossAccountAccessData: {},
            crossAccountAccessHeader: []
        };

        this.checkExposedKeys(authUser);
        this.checkCrossAccountAccess(authUser);
        this.openService = this.openService.bind(this);
    }

    openService(id) {
        switch (id) {
            case "exposedKeys" :
                this.setState({
                    exposedKeys: !this.state.exposedKeys
                });
                break;
            case "crossAccountAccess" :
                this.setState({
                    crossAccountAccess: !this.state.crossAccountAccess
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
            let keyData = [];
            keyData.push(passed[i]);
            keyData.push(STATUS_PASSED);
            tableData.push(keyData);
        }
        for(let i = 0; i<failed.length; i++){
            let keyData = [];
            keyData.push(failed[i]);
            keyData.push(STATUS_FAILED);
            tableData.push(keyData);
        }
        let chartData = [{ name: 'Keys', passed: passedCount, failed: failedCount}];
        callback(header, tableData, chartData)
    }

    checkExposedKeys() {
        KmsApi.checkExposedKeys(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Exposed Keys Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        exposedKeysChartData: chartData,
                        exposedKeysData: tableData,
                        exposedKeysHeader: header
                    })
                })
            }
        })
    }

    checkCrossAccountAccess() {
        KmsApi.checkCrossAccountAccess(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Cross Account Access Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        crossAccountAccessChartData: chartData,
                        crossAccountAccessData: tableData,
                        crossAccountAccessHeader: header
                    })
                })
            }
        })
    }

    render = () => {
        return(
            <div id="kmsComponent">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Key Management Service (KMS)</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"exposedKeys")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Public Exposed Keys</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.exposedKeys ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="exposedKeys" className="mt-3" style={{display: this.state.exposedKeys ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.exposedKeysData.length > 0 ?
                                        <Rule chartData={this.state.exposedKeysChartData}
                                              tableHeaders={this.state.exposedKeysHeader}
                                              tableTitle={"Public Exposed Keys"}
                                              tableData={this.state.exposedKeysData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"crossAccountAccess")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Cross Account Accessible Keys</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.crossAccountAccess ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="crossAccountAccess" className="mt-3" style={{display: this.state.crossAccountAccess ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.crossAccountAccessData.length > 0 ?
                                        <Rule chartData={this.state.crossAccountAccessChartData}
                                              tableHeaders={this.state.crossAccountAccessHeader}
                                              tableTitle={"Cross Account Accessible Keys"}
                                              tableData={this.state.crossAccountAccessData} />
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

export default KmsComponent;