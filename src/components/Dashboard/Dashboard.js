import React, { useState, useCallback, useEffect } from 'react';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';
import LineChart from '../LineChart/LineChart';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';
  const [chartData, setChartData] =  useState({table: []}); 
  const [allData, setAllData] =  useState({table: []}); 
  const [disableButton, setDisableButton] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [startEvent, setStartEvent] = useState({});
  const [spanEvent, setSpanEvent] = useState({});
  const [dataEvent, setDataEvent] = useState([]);
  const [stopEvent, setStopEvent] = useState({});

  useEffect(() => {
    let key;
    let line;
    let lines = [];

    //Transforming data to attend chart's data structure
    dataEvent.forEach(d => {
      startEvent.select.forEach(s => {
        key = '';
        startEvent.group.forEach(g =>{
          key = key.concat(d[g]).concat(' ');
        });
        line = {
          timestamp: d.timestamp, group: key.slice(0, key.length-1), group_select: key.concat(s), select: s, select_value:  d[s]        
        };
        lines.push(line);
      });
      return lines;
    });

    if(spanEvent.hasOwnProperty('begin') && spanEvent.hasOwnProperty('end')){
      setAllData({table: [...lines]});
      const filteredLines = lines.filter(l => 
        l.timestamp >= spanEvent.begin && l.timestamp <= spanEvent.end
      );
      setChartData({table: [...filteredLines]});
    } else {
      setChartData({table: [...lines]});
    }
  }, [dataEvent, startEvent, spanEvent]);

  const processEvent = useCallback((obj) =>{
    switch (obj.type) {
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

      //Events without the mandatory props are ignored
      if(obj.hasOwnProperty('type') && obj.hasOwnProperty('timestamp')){
        switch (obj.type) {
          // Start events clean possible old data sets and allow new events handling
          case 'start':
            if(!started){
              started = true;
              setAllData({});
              setChartData({});
              processEvent(obj);
            }
            break;
          // Stop events turn the started flag false therefore new events will be ignored
          case 'stop':
            if(started){
              processEvent(obj);
              started = false;
              console.log('stopped');
            }
            break;
          // Span and data events are processed only if a start event was already inputted
          default:
            if(started){
              processEvent(obj);
            }
            break;
        }
      }
    });
  },[processEvent]);

  const generateChartHandler = () => { 
    setShowChart(true);
  };

  const inputHandler = useCallback((input) => { 
    if(input.length > 0 ){
      setDisableButton(false);
      readDataFromInput(input);
    } else {
      setDisableButton(true);
      setShowChart(false);
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
        {showChart &&
        <LineChart 
          data={chartData}
        />}
      </span>
      <Footer 
        disable={disableButton} 
        clicked={generateChartHandler}
      />
    </div>
  );
}

export default Dashboard;
