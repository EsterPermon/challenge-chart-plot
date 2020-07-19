import React from 'react';

import Toolbar from './components/Toolbar/Toolbar'
import './App.css';

function App() {

  const title = 'Ester\'s Challenge';

  return (
    <div className="App">
      <Toolbar title={title}/>
    </div>
  );
}

export default App;
