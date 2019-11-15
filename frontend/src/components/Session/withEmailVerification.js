import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Container
} from "reactstrap";
const needsEmailVerification = authUser =>  
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div className="text-center mt-4" >
                {this.state.isSent ? (
                  <div className="main d-flex w-100">
                  <Container className="d-flex flex-column">
                  <Card>
                  <CardBody>
                    <Row className="h-100">
                      <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">
                        <p>
                        E-Mail confirmation sent: Check your E-Mails (Spam
                        folder included) for a confirmation E-Mail.
                        Refresh this page once you confirmed your E-Mail.
                        </p>
                        <Button
                          color="primary"
                          type="button"
                          onClick={this.onSendEmailVerification}
                          disabled={this.state.isSent}
                        >
                          Send confirmation E-Mail
                        </Button>
                        </div>
                      </Col>
                    </Row>
                    </CardBody>
                  </Card>
                  </Container>
                  </div>
                ) : (
                  <div className="main d-flex w-100">
                  <Container className="d-flex flex-column">
                  <Card>
                  <CardBody>
                    <Row className="h-100">
                      <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">
                        <p>
                          Check your E-Mails (Spam folder
                          included) for a confirmation E-Mail or send
                          another confirmation E-Mail.
                        </p>
                        <Button
                          color="primary"
                          type="button"
                          onClick={this.onSendEmailVerification}
                          disabled={this.state.isSent}
                        >
                          Send confirmation E-Mail
                       </Button>
                        </div>
                      </Col>
                    </Row>
                    </CardBody>
                  </Card>
                  </Container>
                  </div>
                )}
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
