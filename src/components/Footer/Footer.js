import React from 'react';

import './Footer.css';

const Footer = React.memo( props => {

  const buttonTitle = 'Generate Chart';
  return (
    <div className="footer">
      <button 
        className="chart-button"
        disabled={props.disable} 
        onClick={props.clicked}
      >
          {buttonTitle}
      </button>
    </div>
  )
});

export default Footer;