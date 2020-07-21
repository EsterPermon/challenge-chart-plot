import React, { useState, useCallback } from 'react';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';
import LineChart from '../LineChart/LineChart';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';
  const chartData =  { };
  const [disableButton, setDisableButton] = useState(true);
  const [startEvent, setStartEvent] = useState({});
  const [spanEvent, setSpanEvent] = useState({});
  const [dataEvent, setDataEvent] = useState([]);
  const [stopEvent, setStopEvent] = useState({});


  const processEvent = useCallback((obj) =>{
    switch (obj['type']) {
      case 'start':
        setStartEvent({...obj});
        break;
      case 'data':
        setDataEvent(prevData => [...prevData, {...obj}]);
      break;
      case 'span':
        setSpanEvent({...obj});
        break;
      case 'stop':
        setStopEvent({...obj});
        break;
      default:
        break;
    }
  },[]);

  const processDataForChart = () => {
    
  }

  const readDataFromInput = useCallback((input) => {
    let started = false;
    /*
     * Adding double quotes to the keys and replacing
     * single quotes for double quotes in the values
     * to enable the JSON.parse usage
     */
    const regex = /(\w+):/g;
    input = input.replace(regex, (a, b) => "\"" + b + "\":" );
    input = input.replace(/'/g, '"');
    
    input.split('\n').forEach((row) => {
      let obj = JSON.parse(row);
      /*
       * The events are ignored if they don't have the mandatory props or
       * while a start event is not detected
       */
      if(obj.hasOwnProperty("type") && obj.hasOwnProperty("timestamp")){
        if(started){
          processEvent(obj);
        } 
        else if(obj["type"] === 'start'){
          started = true;
          processEvent(obj);
        }
      }
    });
    processDataForChart()
  },[processEvent]);

  const generateChartHandler = () => { console.log('chart')};

  const inputHandler = useCallback((input) => { 
    if(input.length > 0 ){
      setDisableButton(false);
      readDataFromInput(input);
    } else {
      setDisableButton(true);
      console.log('input null');
    }
  },[readDataFromInput]);

  return (
    <div className="dashboard">
      <Toolbar title={title}/>
      <span className="content">
        <UserInput
          sendInput={inputHandler}
        />
        <LineChart 
          data={chartData}
        />
      </span>
      <Footer 
        disable={disableButton} 
        clicked={generateChartHandler}
      />
    </div>
  );
}

export default Dashboard;
