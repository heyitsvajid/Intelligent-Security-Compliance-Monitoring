import React from 'react';
import Rule from '../Rule/Rule';
import API from '../API/networkServiceApi'
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

class NetworkComponent extends React.Component{
    constructor(props){
        console.log('Maddy');
        super(props);
        let authUser = this.props.authUser;

        this.state = {
            port22OpentoAll : false,
            name: authUser ? authUser.name : "",
            securityGroupsAccessChartData : [],
            securityGroupsAccessData : {},
            securityGroupsAccessHeader:[]
        };

        this.securityGroupsChecks(authUser)
        this.openService = this.openService.bind(this)
    }

    openService(id){
        console.log('Maddy');
        switch(id) {
            case "securityGroupsPorts":
                this.setState({
                    port22OpentoAll: !this.state.port22OpentoAll
                });
                break;
            default:
                break;
        }
    }

    getDataFromResponse(response, callback){
        //let status = response.success;
        let passedCount = response.good_groups.length;
        let failedCount = response.warning_groups.length;
        let header = ["Resource Name", "Status"];
        let tableData = [];

        response.good_groups.forEach(securityGroup => {
            let graphData = [];
            graphData.push(securityGroup.GroupName);
            graphData.push(STATUS_PASSED);
            tableData.push(graphData);
        });

        response.warning_groups.forEach(securityGroup => {
            let graphData = [];
            graphData.push(securityGroup.GroupName);
            graphData.push(STATUS_FAILED);
            tableData.push(graphData);
        });

        let chartData = [{name: 'Security Groups', passed : passedCount, failed: failedCount}];
        callback(header, tableData, chartData);
    }

    securityGroupsChecks() {
        API.securityGroupsChecks(this.state.authUser, (err, response) => {
            if(err) console.log("Error fetching security group info");
            else{
                this.getDataFromResponse(response, (header, tableData, chartData) =>{
                    this.setState(
                        {
                            securityGroupsAccessChartData:chartData,
                            securityGroupsAccessData: tableData,
                            securityGroupsAccessHeader: header
                        }
                    )
                })
            }
        })
    }

    render = () =>{
        return(
            <div id="NetworkComponent">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Virtual Private Cloud (VPC)</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this, "securityGroupsPorts")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Open Security Groups</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.port22OpentoAll ? faMinusSquare: faPlusSquare}></FontAwesomeIcon></Col>
                        </Row>
                        <Fade>
                            <div id="secruityGroupAccess" className="mt-2" style={{display: this.state.port22OpentoAll? 'block' : 'none', transition: 'display 1s'}}>
                                {
                                    this.state.securityGroupsAccessData.length > 0 ?
                                    <Rule chartData={this.state.securityGroupsAccessChartData}
                                          tableHeaders={this.state.securityGroupsAccessHeader}
                                          tableTitle={"Open Security Groups on port 22"}
                                          tableData={this.state.securityGroupsAccessData}
                                    />
                                    : "service not in use."
                                }
                            </div>
                        </Fade>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default NetworkComponent;
