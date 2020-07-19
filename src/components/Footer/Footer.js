import React from 'react';

import './Footer.css';

const Footer = props => {

  const buttonTitle = 'GENERATE CHART';
  return (
    <div className="footer">
      <button className="chart-button">{buttonTitle}</button>
    </div>
  )
}

export default Footer;