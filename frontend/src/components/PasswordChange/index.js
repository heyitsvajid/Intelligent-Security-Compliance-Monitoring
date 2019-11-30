import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

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
                <Label>New Password</Label>
                <Input
                  bsSize="lg"
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                  type="password"
                  placeholder="New Password"        
                />
              </FormGroup>
              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input
                  bsSize="lg"
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Confirm New Password"        
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

export default withFirebase(PasswordChangeForm);
