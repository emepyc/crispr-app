import React from 'react';
import './depmapGenesHeader.css';

const header = () => (
  <div className="text-center header-container">
    <h2>
      <span className={'depMap-name'}>DepMap</span>{' '}
      <span className="genes-subname"> | Genes</span>
    </h2>
    <p className="lead">Genetic screens to identify cancer dependencies</p>
  </div>
);

export default header;
