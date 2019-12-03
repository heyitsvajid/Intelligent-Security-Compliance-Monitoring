import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Col,
  Row
} from "reactstrap";

const SignUpPage = () => (
    <div>
    <React.Fragment>
      <div className="main d-flex w-100">
        <Container className="d-flex flex-column">
          <Row className="h-100">
            <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
              <SignUpForm />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        });
      })
      .then(() => {
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
  
    return (
      <React.Fragment>
      <div className="text-center mt-4">
        <h1 className="h2">Sign Up</h1>
      </div>
  
      <Card>
        <CardBody>
          <div className="m-sm-4">
            <Form  onSubmit={this.onSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  bsSize="lg"
                  type="text"
                  placeholder="Enter your name"
                  name="username"
                  value={username}
                  onChange={this.onChange}        
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  bsSize="lg"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={this.onChange}        
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input
                  bsSize="lg"
                  type="password"
                  placeholder="Enter password"
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Confirm Password</Label>
                <Input
                  bsSize="lg"
                  type="password"
                  placeholder="Enter password"
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                />
              </FormGroup>
              <div className="text-center mt-3">
                  <Button color="primary" size="lg" disabled={isInvalid} type="submit">
                    Sign up
                  </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              {error && <p className="text-danger">{error.message}</p>}
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
