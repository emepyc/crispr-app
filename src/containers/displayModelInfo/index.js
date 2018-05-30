import React from 'react';

import Card from '../card';
import '../displayGeneInfo/displayGeneInfo.css';

function DisplayModelInfo(props) {
  const { model } = props;

  if (!model.data) {
    return <div />;
  }

  const header = (
    <span className="gene-info-header">{model.data.attributes.model_name}</span>
  );

  const body = (
    <div className="gene-info-body">
      <div className="gene-info-section">
        Tissue: <b>{model.data.attributes.tissue}</b>
      </div>
      <div className="gene-info-section">
        Cancer type: <b>{model.data.attributes.cancer_type}</b>
      </div>
    </div>
  );

  return (
    <div className="gene-info-container">
      <Card header={header} body={body} />
    </div>
  );
}

export default DisplayModelInfo;
