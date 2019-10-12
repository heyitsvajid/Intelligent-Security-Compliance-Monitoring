import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Container
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {ORGANIZATIONS} from '../../constants/organizations';
 
import {
  faFacebook,
  faGoogle,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

const SignInPage = () => (
  <div>
    <React.Fragment>
      <div className="main d-flex w-100">
        <Container className="d-flex flex-column">
          <Row className="h-100">
            <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <SignInForm />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });        
        if(ORGANIZATIONS[this.props.match.params.org]){
          let URL = ROUTES.HOME.replace(":org", this.props.match.params.org);
          this.props.history.push(URL);
        }else{
          let URL = ROUTES.HOME.replace(":org", "");
          this.props.history.push(URL);
        }
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
<React.Fragment>
<div className="text-center mt-4">
      <p className="lead">Sign in to your account to continue</p>
    </div>
<Card>
  <CardBody>
    <div className="m-sm-4">
      <Form  onSubmit={this.onSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            bsSize="lg"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"  
            autoFocus
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            bsSize="lg"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={this.onChange}  
          />
          <small>
            <PasswordForgetLink />
          </small>
        </FormGroup>
        <div>
          {/* <CustomInput
            type="checkbox"
            id="rememberMe"
            label="Remember me next time"
            defaultChecked
          /> */}
        </div>
        <div className="text-center mt-3">
            <Button disabled={isInvalid} type="submit" color="primary" size="md">
              Sign in
            </Button>
            </div> 

            <div className="text-center mt-3">
              {error && <p  className="text-danger">{error.message}</p>}
            </div> 
      </Form>
      {/* <div className="text-center mt-3">
          <SignInGoogle />
      </div>

      <div className="text-center mt-3">
          <SignInFacebook />
      </div> */}

          {/* <div className="text-center mt-3">
          <SignInTwitter />
          </div> */}

          <div className="text-center mt-3">
          <SignUpLink />
          </div>

    </div>
  </CardBody>
</Card>
</React.Fragment>

    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
        });
      })
      .then(() => {
        this.setState({ error: null });
        if(ORGANIZATIONS[this.props.match.params.org]){
          let URL = ROUTES.HOME.replace(":org", this.props.match.params.org);
          this.props.history.push(URL);
        }else{
          let URL = ROUTES.HOME.replace(":org", "");
          this.props.history.push(URL);
        }      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <Button type="submit" color="google" className="mr-1 mb-1">
          <FontAwesomeIcon icon={faGoogle} className="align-middle" /> Sign In with Google
        </Button>
        {error && <p className="text-danger">{error.message}</p>}
      </form>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          });
      })
      .then(() => {
        this.setState({ error: null });
        if(ORGANIZATIONS[this.props.match.params.org]){
          let URL = ROUTES.HOME.replace(":org", this.props.match.params.org);
          this.props.history.push(URL);
        }else{
          let URL = ROUTES.HOME.replace(":org", "");
          this.props.history.push(URL);
        }
            })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <Button type="submit" color="facebook" className="mr-1 mb-1">
          <FontAwesomeIcon icon={faFacebook} className="align-middle" />{" "}
          Sign In with Facebook
        </Button>

        {error && <p className="text-danger">{error.message}</p>}
      </form>
    );
  }
}

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          });
      })
      .then(() => {
        this.setState({ error: null });
        if(ORGANIZATIONS[this.props.match.params.org]){
          let URL = ROUTES.HOME.replace(":org", this.props.match.params.org);
          this.props.history.push(URL);
        }else{
          let URL = ROUTES.HOME.replace(":org", "");
          this.props.history.push(URL);
        }
            })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <Button type="submit" color="twitter" className="mr-1 mb-1">
          <FontAwesomeIcon icon={faTwitter} className="align-middle" /> Sign In with Twitter
        </Button>
        {error && <p  className="text-danger">{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
  withRouter,
  withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
