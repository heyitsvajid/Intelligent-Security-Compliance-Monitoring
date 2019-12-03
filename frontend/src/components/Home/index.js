import React from 'react';
import { compose } from 'recompose';
import API from '../API/index'
import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row
} from "reactstrap";


import {Tabs, Tab} from 'react-bootstrap';
import CloudTrailComponent from "./cloudTrailComponent";
import ElbComponent from './elbComponent';
import KmsComponent from './kmsComponent';
import Ec2Component from './ec2Component';
import IamComponent from './iamComponent';
import RDSComponent from './rdsComponent';
import S3Component from './s3Component';
import NetworkComponent from './networkComponent';

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
      name: authUser ? authUser.name : "",
      authUser: authUser
    };    
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
                      <Tabs id="tabView" defaultActiveKey="vpc">
                      <Tab title="Auto Scaling" eventKey="autoScaling">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="Cloud Trail" eventKey="cloudTrail">
                              <CloudTrailComponent/>
                          </Tab>
                          <Tab title="EC2" eventKey="ec2">
                              <Ec2Component/>
                          </Tab>
                          <Tab title="ELB" eventKey="elb">
                              <ElbComponent/>
                          </Tab>
                          <Tab title="IAM" eventKey="iam">
                              <IamComponent/>
                          </Tab>
                          <Tab title="KMS" eventKey="kms">
                              <KmsComponent/>
                          </Tab>
                          <Tab title="RDS" eventKey="rds">
                              <RDSComponent/>
    </Tab>
                          <Tab title="S3" eventKey="s3">
                              <S3Component/>
                          </Tab>
                          <Tab title="VPC" eventKey="vpc">
                              <NetworkComponent/>
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