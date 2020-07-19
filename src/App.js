import React from 'react';

import Toolbar from './components/Toolbar/Toolbar'
import './App.css';
import Footer from './components/Footer/Footer';
import UserInput from './components/UserInput/UserInput';

function App() {

  const title = 'Ester\'s Challenge';

  return (
    <div className="App">
      <Toolbar title={title}/>
      <UserInput />
      <Footer/>
    </div>
  );
}

export default App;
