import React from 'react';
import Card from '../card';
import './geneEssentialitiesDetails.css';
import GeneEssentialitiesPlot from '../geneEssentialitiesPlot';
import CustomTable from '../customTable';
import { Row, Col } from 'reactstrap';

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
      <CustomTable gene={props.gene} tissue={props.tissue} />
    </div>
  );
};

export default geneEssentialitiesDetails;
