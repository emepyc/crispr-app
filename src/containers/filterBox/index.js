import React from 'react';
import './filter-box.css';

const filterBox = props => (
  <div className={'filter-box-container'}>
    <div className={'filter-box-header'}>{props.header}</div>
    <div className={'filter-box-body'}>{props.body}</div>
  </div>
);

export default filterBox;
