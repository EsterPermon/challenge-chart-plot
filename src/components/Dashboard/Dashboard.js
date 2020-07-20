import React, { useState, useCallback } from 'react';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';
import LineChart from '../LineChart/LineChart';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';
  const [disableButton, setDisableButton] = useState(true);
  const chartData =  { };

  const generateChartHandler = () => { console.log('chart')};

  const inputHandler = useCallback((input) => { 
    if(input.length > 0 ){
      setDisableButton(false);
      console.log(input)
    } else {
      setDisableButton(true);
      console.log('input null');
    }
  }, []);

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
