import React from "react";
import RuleTable from '../Rule/RuleTable'
import RuleBarChart from '../Rule/RuleBarChart'
<<<<<<< HEAD
=======
import Fade from 'react-reveal/Fade';
>>>>>>> 0afd4c425578cfb9f8d5ad6fd138977ff468f6dc
import {
    Col,
    Row
  } from "reactstrap";
class Rule extends React.Component {
    constructor(props) {
      super(props);
<<<<<<< HEAD
=======
        // debugger
>>>>>>> 0afd4c425578cfb9f8d5ad6fd138977ff468f6dc
    let tableData = this.props.tableData ? this.props.tableData : []
    let tableHeaders = this.props.tableHeaders ? this.props.tableHeaders : []
    let tableTitle = this.props.tableTitle ? this.props.tableTitle : ""
    let chartData = this.props.chartData ? this.props.chartData : []

      this.state = {
          tableData,
          tableHeaders,
          chartData,
          tableTitle
      };
    }
  
    render = () => {
      return (
<<<<<<< HEAD
=======
        <Fade>
>>>>>>> 0afd4c425578cfb9f8d5ad6fd138977ff468f6dc
        <div  className="mt-3 mb-3">
          <Row>
          <Col md="7">
          <h4><b>Rule: </b>{this.state.tableTitle}</h4>

            {
              this.state.tableData.length > 0 ?
              <RuleTable headers = {this.state.tableHeaders} rows = {this.state.tableData} title = {this.state.tableTitle} />
<<<<<<< HEAD
              : "No data available for rule" + this.state.title + "."
=======
              : "Service not in use."
>>>>>>> 0afd4c425578cfb9f8d5ad6fd138977ff468f6dc
            }
            </Col>
            <Col md="5">
              {
              this.state.chartData.length > 0 ?
              <RuleBarChart chartData = {this.state.chartData}/>                       
              : ""
            }
            </Col>
          </Row>
        </div>
<<<<<<< HEAD
=======
        </Fade>
>>>>>>> 0afd4c425578cfb9f8d5ad6fd138977ff468f6dc
);
    }
  }

export default Rule;
