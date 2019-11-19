import React from "react";
import RuleTable from '../Rule/RuleTable'
import RuleBarChart from '../Rule/RuleBarChart'
import Fade from 'react-reveal/Fade';
import {
    Col,
    Row
  } from "reactstrap";
class Rule extends React.Component {
    constructor(props) {
      super(props);
        debugger
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
        <Fade>
        <div  className="mt-3 mb-3">
          <Row>
          <Col md="7">
          <h4><b>Rule: </b>{this.state.tableTitle}</h4>

            {
              this.state.tableData.length > 0 ?
              <RuleTable headers = {this.state.tableHeaders} rows = {this.state.tableData} title = {this.state.tableTitle} />
              : "Service not in use."
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
        </Fade>
);
    }
  }

export default Rule;
