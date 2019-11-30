import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import SignOutLink from '../SignOut';
import * as ROUTES from '../../constants/routes';
import LogoImg from '../../assets/img/logo.png';
import { Col,
} from "reactstrap";
import {
  Collapse,
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <div> 
          <NavigationAuth authUser={authUser} />
        </div>
      ) : (
        <NavigationAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <Navbar color="white" fixed="fixed" light expand>
      <Col md="1">
        <a  href="/">
            <img src={LogoImg} height="50" alt="ISCM AWS"/>
        </a>    
        </Col>
        <Col md="6">
          <h2 className="mt-1" style={{color:"white"}}>Intelligent Security Compliance Monitoring</h2>
        </Col>
        <Col md="5" className="mr-2">
        <Collapse navbar>
        <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <span className="d-none d-sm-inline-block" className="header-btn">
                <DropdownToggle nav caret className="header-btn">
                  <span className="text-light">{authUser ? authUser.email: <Link style={{color: 'white', fontSize: '20px'}} to={ROUTES.SIGN_IN}>Sign In</Link> }</span>
                </DropdownToggle>
              </span>
              {authUser ? <DropdownMenu right>
                <DropdownItem > <Link to={ROUTES.ACCOUNT}>Change Password</Link></DropdownItem>
                <DropdownItem><SignOutLink/></DropdownItem>
              </DropdownMenu> : ""}
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
        </Col>
  </Navbar>
);

export default Navigation;
