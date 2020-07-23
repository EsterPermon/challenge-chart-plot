import React, { useState, useCallback, useEffect, useRef } from 'react';

import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';
import LineChart from '../LineChart/LineChart';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';
  const spanEventPropertiesLength = 4;
  const startEventPropertiesLength = 4;
  const stopEventPropertiesLength = 2;
  let dataEventPropertiesLength = useRef();
  const [chartData, setChartData] =  useState({table: []}); 
  const [allData, setAllData] =  useState({table: []}); 
  const [disableButton, setDisableButton] = useState(true);
  const [resize, setResize] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [startEvent, setStartEvent] = useState({});
  const [spanEvent, setSpanEvent] = useState({});
  const [dataEvent, setDataEvent] = useState([]);
  const [stopEvent, setStopEvent] = useState({});
  const [invalidInput, setInvalidInput] = useState('');
  const [ignoredInput, setIgnoredInput] = useState('');
  const [endOfInputHandling, setEndOfInputHandling] = useState(false);

  useEffect(() => {
    invalidInput.length === 0 ? setDisableButton(false) : setDisableButton(true);
  }, [endOfInputHandling, invalidInput])

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
    });

    setAllData({table: [...lines]});
  }, [dataEvent, startEvent]);

  const checkObjectPropertiesLength = (obj, propertiesLength, lineNumber) => {
    if(Object.keys(obj).length < propertiesLength){
      setIgnoredInput(prev => prev.length ? prev : 'Missing property at line '.concat(lineNumber));
      return false;
    }
    return true;
  }

  const newSpanEventHandler = useCallback((obj, lineNumber) =>{
    if(obj.hasOwnProperty('begin') && 
      obj.hasOwnProperty('end') && 
      obj.begin <= obj.end) {
        setSpanEvent({...obj});
    } else {
      setIgnoredInput(prev => prev.length ? prev : 'Invalid span event at line '.concat(lineNumber));
    }
  },[]);

  const newDefaultEventHandler = useCallback((obj, eventPropertiesLength, started, stopped, lineNumber, isData) => {
    if(checkObjectPropertiesLength(obj, eventPropertiesLength, lineNumber)){
      if(started){
        if(isData) {
          setDataEvent(prevData => [...prevData, {...obj}])
        } else {
          newSpanEventHandler(obj, lineNumber);
        }
      } else if(stopped){
        setIgnoredInput(prev => prev.length ? prev : 'Inputs after stop event ignored at line '.concat(lineNumber));
      } else{
      setIgnoredInput(prev => prev.length ? prev : 'Inputs before start event ignored at line '.concat(lineNumber));
      }
    }
    return false;
  }, [newSpanEventHandler]);

  const newStartEventHandler = (obj) => {
    dataEventPropertiesLength.current = 2 + obj.select.length + obj.group.length;
    setAllData({});
    setStartEvent({...obj});
  }

  /*
     * Adding double quotes to the keys and replacing
     * single quotes for double quotes in the values
     * to enable the JSON.parse usage
     */
  const inputParse = (input) => {
    const regex = /(\w+):/g;
    input = input.replace(regex, (a, b) => "\"" + b + "\":" );
    input = input.replace(/'/g, '"');
    return input.split("\n");
  }

  const readDataFromInput = useCallback((input) => {
    let started = false;
    let stopped = false;
    let interrupted = false;
    let obj;
    const inputLines = inputParse(input);

    for(let i=0; i<inputLines.length; i++ ) {
      try {
        obj = JSON.parse(inputLines[i]);
      //Events without the mandatory props are ignored
        if(obj.hasOwnProperty('type') && obj.hasOwnProperty('timestamp')){
          switch (obj.type) {
            // Start events clean possible old data sets and allow new events handling
            case 'start':
              if(!started){
                if(!checkObjectPropertiesLength(obj, startEventPropertiesLength, i+1)){
                  break;
                }
                newStartEventHandler(obj);
                started = true
              } else {
                setIgnoredInput(prev => prev.length ? prev : 'New start event before stop event ignored at line '.concat(i+1));
              }
              break;
            // Stop events turn the started flag false therefore new events will be ignored
            case 'stop':
              if(started){
                if(checkObjectPropertiesLength(obj, stopEventPropertiesLength, i+1)){
                  setStopEvent({...obj});
                  started = false;
                  stopped = true;
                }
              } else {
                setIgnoredInput(prev => prev.length ? prev : 'Inputs before start event ignored at line '.concat(i+1));
              }
              break;
            // Span and data events are processed only if a start event was already inputted
            case 'span':
              newDefaultEventHandler(obj, spanEventPropertiesLength, started, stopped, i+1, false);
              break;
            case 'data':
              newDefaultEventHandler(obj, dataEventPropertiesLength.current, started, stopped, i+1, true);
              break;
            default:
              setIgnoredInput(prev => prev.length ? prev : 'Invalid event type at line '.concat(i+1));
              break;
          }
        } else {
          setInvalidInput(prev => prev.length ? prev : 'Missing mandatory property at line '.concat(i+1));
          interrupted = true;
          break;
        }
      }
      catch (e) {
        setInvalidInput(prev => prev.length ? prev : 'Malformed input at line '.concat(i+1));
        console.log(e);
        interrupted = true;
        break;
      }
    }
    if(!started && !stopped && !interrupted){
      setInvalidInput(prev => prev.length ? prev : 'Start event not found');
    }
    setEndOfInputHandling(prev => !prev);
  },[newDefaultEventHandler]);

  const generateChartHandler = () => { 
    setShowChart(true);
    if(Object.keys(spanEvent).length > 0 ){
      const filteredLines = allData.table.filter(l => 
        l.timestamp >= spanEvent.begin && l.timestamp <= spanEvent.end
      );
      setChartData({table: [...filteredLines]});
    } else {
      setChartData({table: [...allData.table]});
    }
  };

  const inputHandler = useCallback((input) => { 
    setInvalidInput('');
    setIgnoredInput('');

    if(input.length > 0 ){
      readDataFromInput(input);
    } else {
      setDisableButton(true);
    }
  },[readDataFromInput]);

  const resizeHandler = useCallback(() => {
    setResize(prevResize => !prevResize);
  }, []);

  return (
    <div className="dashboard">
      <Toolbar title={title}/>
      {invalidInput &&
        <p className="message error">
          <ErrorIcon className="icon" />
          {invalidInput}!
        </p>
      }
      {ignoredInput &&
        <p className="message warning">
          <WarningIcon className="icon" />
          {ignoredInput}!
        </p>
      }
      <span className="content">
        <UserInput
          sendInput={inputHandler}
          sendResizeEvent={resizeHandler}
        />
        {showChart &&
        <LineChart 
          data={chartData}
          resizeChart={resize}
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
