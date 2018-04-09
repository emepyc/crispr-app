import React from 'react';
import { Card } from 'reactstrap';
import './filter-box.css';

const filterBox = props => (
  <Card>
    <div className={'filter-box-container'}>
      <div className={'filter-box-header'}>{props.header}</div>
      <div className={'filter-box-body'}>{props.body}</div>
    </div>
  </Card>
);

export default filterBox;
