import React from 'react';
import '../../assets/css/custom.css'
import ImageDiv from '../../assets/img/lake.jpg';
import BookImg from '../../assets/img/yaseer_book.png';

import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";

import HomePageImg from '../../assets/img/homepage.jpg';
import Timeline from "../../components/Timeline";
import TimelineItem from "../../components/TimelineItem";

class Landing extends React.Component{

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "monthly"
    };
    this.openQuiz = this.openQuiz.bind(this)
    }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  openQuiz(){
    window.location.href = "/quiz"
  }

  render(){
    return(
      <div>  </div>
    )
  }
}

export default Landing;
