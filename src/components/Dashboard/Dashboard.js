import React, { useState, useCallback, useEffect } from 'react';

import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';
import LineChart from '../LineChart/LineChart';

import DashboardInputValidator from './DashboardInputValidator';
import '../../utils/string_extensions';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';
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

  const dashboardInputParser = new DashboardInputValidator(setStartEvent, setSpanEvent, setDataEvent, 
    setStopEvent, setInvalidInput, setIgnoredInput, setEndOfInputHandling);
  const readDataFromInput = dashboardInputParser.readDataFromInput;

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
          key = key.concat(d[g].toTitleCase()).concat(' ');
        });
        line = {
          timestamp: d.timestamp, 
          group: key.slice(0, key.length-1), 
          group_select: key.concat(s), 
          select: s.toTitleCase(), 
          select_value:  d[s]        
        };
        lines.push(line);
      });
    });

    setAllData({table: [...lines]});
  }, [dataEvent, startEvent]);

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
