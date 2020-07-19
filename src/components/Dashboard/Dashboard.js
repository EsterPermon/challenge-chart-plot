import React from 'react';

import Toolbar from '../Toolbar/Toolbar'
import './Dashboard.css';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';

const Dashboard = props => {

  const title = 'Ester\'s Challenge';

  return (
    <div className="dashboard">
      <Toolbar title={title}/>
      <UserInput />
      <Footer/>
    </div>
  );
}

export default Dashboard;
