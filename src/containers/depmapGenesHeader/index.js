import React from 'react';
import depmapGenesHeaderCss from './depmapGenesHeader.css';

const header = () => (
  <div className="text-center header-container">
    <h2>
      DepMap <span className="col-genes"> | </span>Genes
    </h2>
    <p className="lead secondary">
      Genetic screens to identify cancer dependencies
    </p>
  </div>
);

export default header;
