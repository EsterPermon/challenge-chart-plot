import React from 'react';

import Toolbar from './components/Toolbar/Toolbar'
import './App.css';
import Footer from './components/Footer/Footer';

function App() {

  const title = 'Ester\'s Challenge';

  return (
    <div className="App">
      <Toolbar title={title}/>
      <Footer/>
    </div>
  );
}

export default App;
