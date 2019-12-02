import React from 'react';
import Rule from '../Rule/Rule';
import Ec2Api from '../API/ec2Api';
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

class Ec2Component extends React.Component{
    constructor(props) {
        super(props);
        let authUser = this.props.authUser;

        this.state = {
      unusedAmis:false,
      underutilizedInstances:false,
      unEncryptedAMIS:false,
      unrestrictedSecurityGroupAttachedEC2Instance:false,
      unAssociatedEIPs:false,
      unusedEc2KeyPairs:false,
      name: authUser ? authUser.name : "",
      authUser: authUser,
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

        };

        this.unusedAmis(authUser);
        this.underutilizedInstances(authUser);
        this.unrestrictedSecurityGroupAttachedEC2Instance(authUser);
        this.unEncryptedAMIS(authUser);
        this.unAssociatedEIPs(authUser);
        this.unusedEc2KeyPairs(authUser);
        this.openService = this.openService.bind(this);
    }

    openService(id) {
        switch (id) {
            case "unusedAmis":
                this.setState({
                    unusedAmis: !this.state.unusedAmis
                });
                break;
            case "underutilizedInstances":
                this.setState({
                    underutilizedInstances: !this.state.mfunderutilizedInstancesaDelete
                });
                break;
            case "unEncryptedAMIS":
                this.setState({
                    unEncryptedAMIS: !this.state.unEncryptedAMIS
                });
                break;
            case "unrestrictedSecurityGroupAttachedEC2Instance":
                this.setState({
                    unrestrictedSecurityGroupAttachedEC2Instance: !this.state.unrestrictedSecurityGroupAttachedEC2Instance
                });
                break;
            case "unAssociatedEIPs":
                this.setState({
                    unAssociatedEIPs: !this.state.unAssociatedEIPs
                });
                break;
            case "unusedEc2KeyPairs":
                this.setState({
                    unusedEc2KeyPairs: !this.state.unusedEc2KeyPairs
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

   //ec2

unusedAmis() {
    Ec2Api.unusedAmis(this.state.authUser, (err, response) => {
        if(err){
            console.log("Error fetching unusedAmis")
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
    Ec2Api.underutilizedInstances(this.state.authUser, (err, response) => {
        if(err){
            console.log("Error fetching underutilizedInstances")
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
    Ec2Api.unrestrictedSecurityGroupAttachedEC2Instance(this.state.authUser, (err, response) => {
        if(err){
            console.log("Error fetching unrestrictedSecurityGroupAttachedEC2Instance")
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
    Ec2Api.unEncryptedAMIS(this.state.authUser, (err, response) => {
        if(err){
            console.log("Error fetching unEncryptedAMIS")
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
    Ec2Api.unAssociatedEIPs(this.state.authUser, (err, response) => {
        if(err){
            console.log("Error fetching unAssociatedEIPs")
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
    Ec2Api.unusedEc2KeyPairs(this.state.authUser, (err, response) => {
        if(err){
            console.log("Error fetching unusedEc2KeyPairs")
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

    render = () => {
        return(
            <div id="Ec2Component">
                <Card>
                    <CardHeader>
                        <Row className="mt-3">
                            <Col style = {{textAlign: 'center'}}>
                                <h1 style = {{color: '#2698da ', fontSize: 20}}>Elastic Compute Cloud (EC2)</h1>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row onClick={this.openService.bind(this,"unusedAmis")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Unused Amazon Machine Image Check</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unusedAmis ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unusedAmis" className="mt-3" style={{display: this.state.unusedAmis ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unusedAmisData.length > 0 ?
                                        <Rule chartData={this.state.unusedAmisChartData}
                                              tableHeaders={this.state.unusedAmisHeader}
                                              tableTitle={"Access Logging for Cloud Trail Buckets"}
                                              tableData={this.state.unusedAmisData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"underutilizedInstances")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>Under Utilized Ec2 Instances</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.underutilizedInstances ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="underutilizedInstances" className="mt-3" style={{display: this.state.underutilizedInstances ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.underutilizedInstancesData.length > 0 ?
                                        <Rule chartData={this.state.underutilizedInstancesChartData}
                                              tableHeaders={this.state.underutilizedInstancesHeader}
                                              tableTitle={"MFA Delete for Cloud Trail Buckets"}
                                              tableData={this.state.underutilizedInstancesData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"unEncryptedAMIS")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>UnEncrypted AMIs</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unEncryptedAMIS ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unEncryptedAMIS" className="mt-3" style={{display: this.state.unEncryptedAMIS ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unEncryptedAMISData.length > 0 ?
                                        <Rule chartData={this.state.unEncryptedAMISChartData}
                                              tableHeaders={this.state.unEncryptedAMISHeader}
                                              tableTitle={"Insecure Buckets for Cloud Trail"}
                                              tableData={this.state.unEncryptedAMISData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"unrestrictedSecurityGroupAttachedEC2Instance")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>unrestrictedSecurityGroupAttachedEC2Instance</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unrestrictedSecurityGroupAttachedEC2Instance ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unrestrictedSecurityGroupAttachedEC2Instance" className="mt-3" style={{display: this.state.unrestrictedSecurityGroupAttachedEC2Instance ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unrestrictedSecurityGroupAttachedEC2InstanceData.length > 0 ?
                                        <Rule chartData={this.state.unrestrictedSecurityGroupAttachedEC2InstanceChartData}
                                              tableHeaders={this.state.unrestrictedSecurityGroupAttachedEC2InstanceHeader}
                                              tableTitle={"Log File Encryption for Cloud Trail Buckets"}
                                              tableData={this.state.unrestrictedSecurityGroupAttachedEC2InstanceData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"unAssociatedEIPs")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>unAssociatedEIPsHeader</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unAssociatedEIPs ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unAssociatedEIPs" className="mt-3" style={{display: this.state.unAssociatedEIPs ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unAssociatedEIPsData.length > 0 ?
                                        <Rule chartData={this.state.unAssociatedEIPsChartData}
                                              tableHeaders={this.state.unAssociatedEIPsHeader}
                                              tableTitle={"Multi Region Access for Cloud Trails"}
                                              tableData={this.state.unAssociatedEIPsData} />
                                        : "Service not in use."
                                }
                            </div>
                        </Fade>
                        <hr/>

                        <Row onClick={this.openService.bind(this,"unusedEc2KeyPairs")} style={{cursor: "pointer"}}>
                            <Col md="11"><h4><b>unusedEc2KeyPairs</b></h4></Col>
                            <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.unusedEc2KeyPairs ? faMinusSquare: faPlusSquare}/></Col>
                        </Row>
                        <Fade>
                            <div  id="unusedEc2KeyPairs" className="mt-3" style={{display: this.state.unusedEc2KeyPairs ? 'block' : 'none',transition: 'display 1s'}}>
                                {
                                    this.state.unusedEc2KeyPairsData.length > 0 ?
                                        <Rule chartData={this.state.unusedEc2KeyPairsChartData}
                                              tableHeaders={this.state.unusedEc2KeyPairsHeader}
                                              tableTitle={"Log File Integrity Validation for Cloud Trails"}
                                              tableData={this.state.unusedEc2KeyPairsData} />
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

export default Ec2Component;