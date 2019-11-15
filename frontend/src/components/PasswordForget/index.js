import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import Swal from 'sweetalert2'

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
const PasswordForgetPage = () => (
    <div>
    <React.Fragment>
      <div className="main d-flex w-100">
        <Container className="d-flex flex-column">
          <Row className="h-100">
            <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <PasswordForgetForm />
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
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

  }

  onSubmit = event => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.SIGN_IN);
        Swal.fire({
          type: 'success',
          title: 'Password reset email sent. Check you mail.',
          showConfirmButton: false,
        })
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
        <React.Fragment>
        <div className="text-center">
          <h1 className="h2">Reset password</h1>
          <p className="lead">Enter your email to reset your password.</p>
        </div>
    
        <Card>
          <CardBody>
            <div className="m-sm-4">
              <Form  onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    bsSize="lg"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <div className="text-center mt-3 mb-3">
                    <Button disabled={isInvalid} type="submit" color="primary" size="lg">
                      Reset password
                    </Button>
                </div>
              </Form>
              {error && <p className="text-danger">{error.message}</p>}
            </div>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = compose(
  withRouter,
  withFirebase,
)(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
