import React from 'react';
import './homeSectionDescription.css';

const homeSectionDescription = props => (
  <div className={'container'}>
    <div
      className={
        'home-section-description row justify-content-center align-self-center'
      }
    >
      {props.children}
    </div>
  </div>
);

export default homeSectionDescription;
