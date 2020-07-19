import React from 'react';

import './Toolbar.css';

const Toolbar = React.memo(props => {
  return (
    <div className="toolbar">
      <h1>
        {props.title}
      </h1>
    </div>
  )
});

export default Toolbar;