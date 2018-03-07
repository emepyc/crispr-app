import React from 'react';
import Card from '../card';
import displayGeneInfoCss from './displayGeneInfo.css';

const displayGeneInfo = props => {
  if (!props.gene.data) {
    return <div />;
  }
  const header = <span>Header here</span>;
  const body = (
    <div className="gene-info-header">{props.gene.data.attributes.symbol}</div>
  );

  return (
    <div className="gene-info-container">
      <Card header={header} body={body} />
    </div>
  );
};

export default displayGeneInfo;
