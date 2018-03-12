import React from 'react';
import Card from '../card';
import geneEssentialitiesDetailsCss from './geneEssentialitiesDetails.css';
import GeneEssentialitiesPlot from '../geneEssentialitiesPlot';

const geneEssentialitiesDetails = props => {
  if (!props.data) {
    return <div />;
  }
  const header = <div>Screening results</div>;
  const body = (
    <div>
      <GeneEssentialitiesPlot data={props.data} />
    </div>
  );

  return (
    <div className="gene-essentialities-details-container">
      <Card header={header} body={body} />
    </div>
  );
};

export default geneEssentialitiesDetails;
