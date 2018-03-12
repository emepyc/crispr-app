import React from 'react';
import Card from '../card';
import geneEssentialitiesSummaryCss from './geneEssentialitiesSummary.css';

const geneEssentialitiesSummary = props => {
  if (!props.data) {
    return <div />;
  }
  const header = <div>Summary of screen results for gene {props.gene}</div>;
  const body = (
    <div>
      <div>
        {props.data.models.significant} significant models out of{' '}
        {props.data.models.total}
      </div>
      <div>etc...</div>
    </div>
  );
  return (
    <div className="gene-essentialities-summary-container">
      <Card header={header} body={body} />
    </div>
  );
};

export default geneEssentialitiesSummary;
