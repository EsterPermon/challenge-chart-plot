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
      }, 
      {
        "name": "hoverLine",
        "value": null,
        "on": [
          {
            "events": "@legendLines:mouseover, @legendLinesLabel:mouseover",
            "update": "datum.value"
          },
          {
            "events": "@legendLines:mouseout, @legendLinesLabel:mouseout",
            "update": "null"
          }
        ]
      },  
      {
        "name": "hoverPoint",
        "value": null,
        "on": [
          {
            "events": "@legendPoints:mouseover, @legendPointsLabel:mouseover",
            "update": "datum.value"
          },
          {
          "events": "@legendPoints:mouseout, @legendPointsLabel:mouseout",
          "update": "null"
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
      {"orient": "bottom", "scale": "x", "labelColor": "gray", "labelFontSize": 12, "grid": true, "gridWidth": 0.2},
      {"orient": "left", "scale": "y", "labelColor": "gray", "labelFontSize": 12, "grid": true, "gridWidth": 0.2}
    ],
    "legends": [
      {
        "fill": "color",
        "symbolSize": 200,
        "labelFontSize": 15,
        "labelColor": "gray",
        "labelFontWeight": 600,
        "orient":"left",
        "encode":{
          "symbols": {
            "name": "legendPoints",
            "interactive": true,
          "update": {
            "opacity": [
              {
                "test": "hoverPoint && hoverPoint == datum.value",
                "value": 0.2
              },
              {
                "value": 1
              }
            ]
          }
        },
        "labels": {
          "name": "legendPointsLabel",
          "interactive": true,
          }
        }
      },
       {
        "stroke": "colorStroke",
        "symbolType": "stroke",
        "symbolStrokeWidth": 5,
        "symbolSize": 250,
        "labelFontSize": 15,
        "labelFontWeight": 600,
        "labelColor": "gray",
        "orient":"left",
        "encode":{
          "symbols": {
            "name": "legendLines",
            "interactive": true,
            "update": {
              "opacity": [
                {
                  "test": "hoverLine && hoverLine != datum.value", 
                  "value": 0.2
                },
                {
                  "value": 1
                }
              ]
            }
          },
          "labels": {
            "name": "legendLinesLabel",
            "interactive": true
          }
       }
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
            },
            "update": {
              "opacity": [
                {
                  "test": "hoverLine && hoverLine != datum.group", 
                  "value": 0.2
                },
                {
                  "value": 1
                }
              ]
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
              "size": {"value": 200},
            },
            "update": {
              "opacity": [
                {
                  "test": "hoverPoint && hoverPoint == datum.select", 
                  "value": 0.2
                },
                {
                  "value": 1
                }
              ]
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