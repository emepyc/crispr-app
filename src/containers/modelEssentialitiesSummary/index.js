import React from 'react';
import Card from '../card';
import './modelEssentialitiesSummary.css';

const modelEssentialitiesSummary = props => {
  if (!props.data) {
    return <div />;
  }
  const header = <div>Summary of screen results for model {props.model}</div>;
  const body = (
    <div>
      <div>
        {props.data.genes.significant} significant genes out of{' '}
        {props.data.genes.total}
      </div>
      <div>etc...</div>
    </div>
  );

  return (
    <div className="model-essentialities-summary-container">
      <Card header={header} body={body} />
    </div>
  );
};

export default modelEssentialitiesSummary;
