import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  Table
} from "reactstrap";

class RuleTable extends React.Component {
    constructor(props) {
      super(props);
  
    let headers = this.props.headers ? this.props.headers : []
    let rows = this.props.rows ? this.props.rows : []
    let title = this.props.title ? this.props.title : ""

      this.state = {
          title,
          rows,
          headers
      };
      this.generateTable = this.generateTable.bind(this);
    }

    generateTable = () => {
        let data = this.state
        if(data.title && data.headers.length > 0 && data.rows.length > 0){
         
            let tableHeader =  data.headers.map((key, index) => {
               return <th key={index}>{key.toUpperCase()}</th>
            })

            let tableRows = data.rows.map((row, index) => {
                let rowData =  row.map((key, i) => {
                    return <td key={i}>{key}</td>
                 })
                return (
                   <tr key={index}>
                    {rowData}
                   </tr>
                )
             }) 
            return (
                <Card>
                <CardHeader>
                  <CardTitle tag="h5">{data.title}</CardTitle>
                </CardHeader>
                <Table striped>
                  <thead>
                    <tr>
                        {tableHeader}
                    </tr>
                  </thead>
                  <tbody>
                        {tableRows}
                  </tbody>
                </Table>
              </Card>
            )
            
        }else{
            return (
                <div>No data available!</div>
            )
        }
    }
  
    render = () => {
      return (
        <div>{this.generateTable()}</div>
      );
    }
  }

  export default RuleTable;
