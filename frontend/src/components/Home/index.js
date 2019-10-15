import React from 'react';
import { compose } from 'recompose';
import RuleTable from '../Rule/RuleTable'
import RuleBarChart from '../Rule/RuleBarChart'

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import Fade from 'react-reveal/Fade';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusSquare,
    faMinusSquare
  } from "@fortawesome/free-regular-svg-icons";

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
      "s3": false,
      "name": authUser ? authUser.name : "",
      "email": authUser ? authUser.email : "",
    };
    this.openService = this.openService.bind(this)
  }

  openService(id) {
    switch(id){
        case 1:
            this.setState({
                s3:!this.state.s3
            }) 
        break    
    }
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
                          <h1 style = {{color: '#2698da '}}>Complaince Report</h1> 
                      </Col>
                      </Row>
                    </CardHeader>
                  <CardBody>
                  <div>
                  <Row onClick={this.openService.bind(this,1)}>
                      <Col md="11"><h4>Simple Storage Service (S3)</h4></Col>
                      <Col md="1"><FontAwesomeIcon size="lg" icon={this.state.s3 ? faMinusSquare: faPlusSquare}/></Col>
                  </Row>
                  <Fade>
                  <div  className="mt-3" style={{display: this.state.s3 ? 'block' : 'none',transition: 'display 1s'}}>
                    <Row>
                      <Col md="5">
                        <RuleBarChart 
                        chartData = {[
                          {
                            name: 'Buckets', passed: 2, failed: 1
                          }
                        ]}/>
                      </Col>
                      <Col md="7">
                      <RuleTable headers = {["Test1", "Test2"]} rows = {[["Test1", "Test2"]]} title = {"Test1"} />
                      </Col>
                    </Row>
                  </div>
                  </Fade>
                  <hr/>
                  </div>         
          </CardBody>
        </Card>
                  </Col>
                <Col md="1"/>
              </Row>
            </Container>
    );
  }
}