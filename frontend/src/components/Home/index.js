import React from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';

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
    console.log(authUser)

    this.state = {
      "name": authUser ? authUser.name : "",
      "email": authUser ? authUser.email : "",
    };
  }

  render = () => {
    return (
      <div>Add Complaince Report</div>
    );
  }
}