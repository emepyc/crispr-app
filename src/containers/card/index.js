import React from 'react';
import CardCSS from './card.css';

const card = props => (
  <div className="card-container">
    <div className="card-header">{props.header}</div>
    <div className="card-body">{props.body}</div>
  </div>
);

export default card;
