import React from 'react';
import { Vega } from 'react-vega';

import './LineChart.css'
 
const LineChart = (props) => {

  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "padding": {
      "top": 20,
      "right": 30,
      "bottom": 20,
      "left": 20
    },
    "autosize": {
      "type": "fit",
      "resize": true,
      "contains": "padding"
    },
    "signals": [
      {
        "name": "resizeChart",
        "value": props.resizeChart
      },
    {
      "name": "width",
      "update": "containerSize()[0]",
      "on": [
        {
          "events": [
            {
              "source": "window",
              "type": "resize"
            },
            {
              "signal": "resizeChart"
            }
          ],
          "update": "containerSize()[0]"
        }
      ]
    },  
    {
      "name": "height",
      "update": "containerSize()[1]",
      "on": [
        {
          "events": [
            {
              "source": "window",
              "type": "resize"
            },
            {
              "signal": "resizeChart"
            }
          ],
          "update": "containerSize()[1]"
        }
      ]
    } 
  ],
    "data": [
      {
        "name": "table"
      }
    ],
  
    "scales": [
      {
        "name": "x",
        "type": "time",
        "range": "width",
        "domain": {"data": "table", "field": "timestamp"}
      },
      {
        "name": "y",
        "type": "linear",
        "range": "height",
        "nice": true,
        "zero": true,
        "domain": {"data": "table", "field": "select_value"}
      },
      {
        "name": "colorStroke",
        "type": "ordinal",
        "range":"category",
        "domain": {"data": "table", "field": "group"}
      },
      {
        "name": "color",
        "type": "ordinal",
        "range":"diverging",
        "domain": {"data": "table", "field": "select"}
      }
    ],
  
    "axes": [
      {"orient": "bottom", "scale": "x"},
      {"orient": "left", "scale": "y"}
    ],
    "legends": [
      {
        "fill": "color",
        "symbolSize": 150,
        "labelFontSize": 15,
        "orient":"left"
      
      },
       {
        "stroke": "colorStroke",
        "symbolType": "stroke",
        "symbolStrokeWidth": 4,
        "labelFontSize": 15,
        "orient":"left"
      }
    ],
    "marks": [
      {
        "type": "group",
        "from": {
          "facet": {
            "name": "series",
            "data": "table",
            "groupby": ["group_select"]
          }
        },
      "marks": [
        {
          "type": "line",
          "from": {"data": "series"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "timestamp"},
              "y": {"scale": "y", "field": "select_value"},
              "stroke": {"scale": "colorStroke", "field": "group"},
              "strokeWidth": {"value": 3},
              "interpolate": {"value": "linear"}
            }
          }
        },
        {
          "type": "symbol",
          "from": {"data": "series"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "timestamp"},
              "y": {"scale": "y", "field": "select_value"},
              "fill": {"scale": "color", "field": "select"},
              "size": {"value": 200}
            }
          }
        }
      ]
      }
    ]
  };

   return (
    <Vega
      className="line-chart" 
      spec={spec}
      data={props.data} 
      actions={false}
    />
  );
  
};

export default LineChart;