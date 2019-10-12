import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {ORGANIZATIONS} from '../../constants/organizations';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            if(ORGANIZATIONS[this.props.match.params.org]){
              let URL = ROUTES.SIGN_IN.replace(":org", this.props.match.params.org);
              this.props.history.push(URL);
            }else{
              let URL = ROUTES.SIGN_IN.replace(":org", "");
              this.props.history.push(URL);
            }
          }
        },
        () => {
          if(ORGANIZATIONS[this.props.match.params.org]){
            let URL = ROUTES.SIGN_IN.replace(":org", this.props.match.params.org);
            this.props.history.push(URL);
          }else{
            let URL = ROUTES.SIGN_IN.replace(":org", "");
            this.props.history.push(URL);
          }
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;
