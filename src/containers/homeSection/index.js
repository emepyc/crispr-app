import React from 'react';
import './homeSection.css';

const homeSection = props => {
  const classNames = ['home-page-section', props.customClass || []].join(' ');

  return (
    <div className={classNames} style={props.customStyle}>
      {props.children}
    </div>
  );
};

export default homeSection;
