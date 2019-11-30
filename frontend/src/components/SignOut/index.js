import React from 'react';

import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

const SignOutLink = ({ firebase }) => (
  <Link to="" onClick={firebase.doSignOut}>
    Sign Out
  </Link>
);

export default withFirebase(SignOutLink);
