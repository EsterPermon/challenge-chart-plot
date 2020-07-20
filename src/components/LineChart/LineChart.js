import React from 'react';
import { Vega } from 'react-vega';

import './LineChart.css'
 
const LineChart = (props) => {

  const spec = { };

  return (
    <Vega className="line-chart" spec={spec} renderer={"svg"} data={props.data} actions={false}/>
  );
  
};

export default LineChart;