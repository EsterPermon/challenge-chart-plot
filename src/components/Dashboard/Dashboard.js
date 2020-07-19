import React, { useState, useCallback } from 'react';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';
  const [disableButton, setDisableButton] = useState(true);

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
      <UserInput
        sendInput={inputHandler}
      />
      <Footer 
        disable={disableButton} 
        clicked={generateChartHandler}
      />
    </div>
  );
}

export default Dashboard;
