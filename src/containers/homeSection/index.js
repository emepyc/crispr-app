import React from 'react';
import './homeSection.css';

const homeSection = props => {
  const classNames = [
    'py-5 container-fluid home-page-section',
    props.customClass || []
  ].join(' ');

  return (
    <div className={classNames} style={props.customStyle}>
      <div className="container">
        <div className="mt-3 mb-2 row">
          <div className="col">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default homeSection;
