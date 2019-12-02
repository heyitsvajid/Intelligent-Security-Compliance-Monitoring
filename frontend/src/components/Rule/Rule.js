import React from "react";
import RuleTable from '../Rule/RuleTable'
import RuleBarChart from '../Rule/RuleBarChart'
import {
    Col,
    Row
  } from "reactstrap";
class Rule extends React.Component {
    constructor(props) {
      super(props);
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
        <div  className="mt-3 mb-3">
          <Row>
          <Col md="7">
            {
              this.state.tableData.length > 0 ?
              <RuleTable headers = {this.state.tableHeaders} rows = {this.state.tableData} title = {this.state.tableTitle} />
              : "No data available for rule" + this.state.title + "."
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
);
    }
  }

export default Rule;
