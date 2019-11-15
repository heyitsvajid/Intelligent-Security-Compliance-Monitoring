import React from "react";
import { Container, Row, Col } from "reactstrap";
import Intercom from 'react-intercom';

const Footer = () => (
  <footer className="footer sticky-bottom">
    <Intercom appID={process.env.REACT_APP_INTERCOM_ID}/>
    <Container fluid>
      <Row className="text-muted">
        <Col xs="6" className="text-left">
          <ul className="list-inline">
            <li className="list-inline-item">
              <span className="text-muted" href="#">
                <a href="mailto:help@freewill.com">Support</a>
              </span>
            </li>
            <li className="list-inline-item">
              <span className="text-muted" href="#">
              <a href="/faq">Help Center</a> 
              </span>
            </li>
            <li className="list-inline-item">
              <span className="text-muted" href="#">
                Privacy
              </span>
            </li>
            <li className="list-inline-item">
              <span className="text-muted" href="#">
              <a href="/terms">Terms of Service</a>
              </span>
            </li>
          </ul>
        </Col>
        <Col xs="6" className="text-right">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} -{" "}
            <span href="/" className="text-muted">
              ISCM For AWS. All Rights Reserved
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
