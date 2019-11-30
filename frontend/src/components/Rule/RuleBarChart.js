import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  }
];

export default class RuleBarChart extends PureComponent {

    constructor(props) {
        super(props);
    
      let chartData = this.props.chartData ? this.props.chartData : []
  
        this.state = {
            chartData
        };
      }

    render() {
    return (
        <div>
        {this.state.chartData.length > 0 ? 
            <BarChart
<<<<<<< HEAD
            width={330}
            height={270}
=======
            width={350}
            height={300}
>>>>>>> 0afd4c425578cfb9f8d5ad6fd138977ff468f6dc
            data={this.state.chartData}
          >
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" fill="green" />
            <Bar dataKey="failed" fill="red" />
          </BarChart>
          : ""}
</div>
    );
  }
}
