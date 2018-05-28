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
      <Row>
        <Col xs={12} lg={6} className="my-auto">
          <Card header={header} body={body} />
        </Col>
        <Col xs={12} lg={6} className="my-auto">
          <CustomTable gene={props.gene} tissue={props.tissue} />
        </Col>
      </Row>
    </div>
  );
};

export default geneEssentialitiesDetails;
