import React from 'react';
import Rule from '../Rule/Rule';
import ElbApi from '../API/elbApi';
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

class ElbComponent extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
            listenerSecurity: false,
            elbHealth: false,
            idleElb: false,
            elbSecurityGroup: false,
            internetFacingElb: false,
            deleteProtection: false,
            name: authUser ? authUser.name : "",
            authUser: authUser,
            listenerSecurityChartData: [],
            listenerSecurityData: {},
            listenerSecurityHeader: [],
            elbHealthChartData: [],
            elbHealthData: {},
            elbHealthHeader: [],
            idleElbChartData: [],
            idleElbData: {},
            idleElbHeader: [],
            elbSecurityGroupChartData: [],
            elbSecurityGroupData: {},
            elbSecurityHeader: [],
            internetFacingElbChartData: [],
            internetFacingElbData: {},
            internetFacingElbHeader: [],
            deleteProtectionChartData: [],
            deleteProtectionData: {},
            deleteProtectionHeader: []
        };

        this.checkElbListenerSecurity(authUser);
        this.checkElbHealth(authUser);
        this.checkIdleElbs(authUser);
        this.checkElbSecurityGroup(authUser);
        this.checkInternetFacingElbs(authUser);
        this.checkElbDeleteProtection(authUser);
        this.openService = this.openService.bind(this);
    }

    openService(id) {
        switch (id) {
            case "listenerSecurity" :
                this.setState({
                    listenerSecurity: !this.state.listenerSecurity
                });
                break;
            case "elbHealth" :
                this.setState({
                    elbHealth: !this.state.elbHealth
                });
                break;
            case "idleElb" :
                this.setState({
                    idleElb: !this.state.idleElb
                });
                break;
            case "elbSecurityGroup" :
                this.setState({
                    elbSecurityGroup: !this.state.elbSecurityGroup
                });
                break;
            case "internetFacingElb" :
                this.setState({
                    internetFacingElb: !this.state.internetFacingElb
                });
                break;
            case "deleteProtection" :
                this.setState({
                    deleteProtection: !this.state.deleteProtection
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
            let elbData = [];
            elbData.push(passed[i]);
            elbData.push(STATUS_PASSED);
            tableData.push(elbData);
        }
        for(let i = 0; i<failed.length; i++){
            let elbData = [];
            elbData.push(failed[i]);
            elbData.push(STATUS_FAILED);
            tableData.push(elbData);
        }
        let chartData = [{ name: 'Load Balancers', passed: passedCount, failed: failedCount}];
        callback(header, tableData, chartData)
    }

    checkElbListenerSecurity() {
        ElbApi.checkElbListenerSecurity(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching ELB Listener Security Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        listenerSecurityChartData: chartData,
                        listenerSecurityData: tableData,
                        listenerSecurityHeader: header
                    })
                })
            }
        })
    }

    checkElbHealth() {
        ElbApi.checkElbHealth(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching ELB Health Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    chartData[0].name = "ELB Target Instances";
                    this.setState({
                        elbHealthChartData: chartData,
                        elbHealthData: tableData,
                        elbHealthHeader: header
                    })
                })
            }
        })
    }

    checkIdleElbs() {
        ElbApi.checkIdleElbs(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Idle ELB Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        idleElbChartData: chartData,
                        idleElbData: tableData,
                        idleElbHeader: header
                    })
                })
            }
        })
    }

    checkElbSecurityGroup() {
        ElbApi.checkElbSecurityGroup(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching ELB Security Group Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    chartData[0].name = "Security Groups";
                    this.setState({
                        elbSecurityGroupChartData: chartData,
                        elbSecurityGroupData: tableData,
                        elbSecurityHeader: header
                    })
                })
            }
        })
    }

    checkInternetFacingElbs() {
        ElbApi.checkInternetFacingElbs(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching Internet Facing ELB Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        internetFacingElbChartData: chartData,
                        internetFacingElbData: tableData,
                        internetFacingElbHeader: header
                    })
                })
            }
        })
    }

    checkElbDeleteProtection() {
        ElbApi.checkElbDeleteProtection(this.state.authUser, (err, response) => {
            if (err) {
                console.log("Error fetching ELB Delete Protection Data");
            }
            else {
                this.getDataFromResponse(response, (header, tableData, chartData) => {
                    this.setState({
                        deleteProtectionChartData: chartData,
                        deleteProtectionData: tableData,
                        deleteProtectionHeader: header
                    })
                })
            }
        })
    }

    render = () => {
        return(
            <div id="elbComponent">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Elastic Load Balancing Service (ELB)</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"listenerSecurity")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Listener Security for App Tier ELBs</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.listenerSecurity ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="listenerSecurity" className="mt-3" style={{display: this.state.listenerSecurity ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.listenerSecurityData.length > 0 ?
                                        <Rule chartData={this.state.listenerSecurityChartData}
                                              tableHeaders={this.state.listenerSecurityHeader}
                                              tableTitle={"Listener Security for App Tier ELBs"}
                                              tableData={this.state.listenerSecurityData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"elbHealth")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>ELB Target Instance Health</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.elbHealth ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="elbHealth" className="mt-3" style={{display: this.state.elbHealth ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.elbHealthData.length > 0 ?
                                        <Rule chartData={this.state.elbHealthChartData}
                                              tableHeaders={this.state.elbHealthHeader}
                                              tableTitle={"ELB Target Instance Health"}
                                              tableData={this.state.elbHealthData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"idleElb")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Idle Load Balancers</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.idleElb ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="idleElb" className="mt-3" style={{display: this.state.idleElb ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.idleElbData.length > 0 ?
                                        <Rule chartData={this.state.idleElbChartData}
                                              tableHeaders={this.state.idleElbHeader}
                                              tableTitle={"Idle Load Balancers"}
                                              tableData={this.state.idleElbData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"elbSecurityGroup")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>ELB Valid Security Groups</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.elbSecurityGroup ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="elbSecurityGroup" className="mt-3" style={{display: this.state.elbSecurityGroup ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.elbSecurityGroupData.length > 0 ?
                                        <Rule chartData={this.state.elbSecurityGroupChartData}
                                              tableHeaders={this.state.elbSecurityHeader}
                                              tableTitle={"ELB Valid Security Groups"}
                                              tableData={this.state.elbSecurityGroupData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"internetFacingElb")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Internet Facing Elbs</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.internetFacingElb ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="internetFacingElb" className="mt-3" style={{display: this.state.internetFacingElb ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.internetFacingElbData.length > 0 ?
                                        <Rule chartData={this.state.internetFacingElbChartData}
                                              tableHeaders={this.state.internetFacingElbHeader}
                                              tableTitle={"Internet Facing Elbs"}
                                              tableData={this.state.internetFacingElbData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"deleteProtection")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Delete Protection for Elbs</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.deleteProtection ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="deleteProtection" className="mt-3" style={{display: this.state.deleteProtection ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.deleteProtectionData.length > 0 ?
                                        <Rule chartData={this.state.deleteProtectionChartData}
                                              tableHeaders={this.state.deleteProtectionHeader}
                                              tableTitle={"Delete Protection for Elbs"}
                                              tableData={this.state.deleteProtectionData} />
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

export default ElbComponent;