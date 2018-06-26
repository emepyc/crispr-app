import React from 'react';
import { Row, Col } from 'reactstrap';

import CustomTable from '../customTable';
import GeneEssentialitiesPlot from '../geneEssentialitiesPlot';
import './modelEssentialitiesDetails.css';

const modelEssentialitiesDetails = props => {
  if (!props.data) {
    return <div />;
  }

  const body = <div />;

  return (
    <div className="gene-essentialities-details-container">
      <Row>
        <Col xs={12} lg={6} className="my-auto">
          <GeneEssentialitiesPlot data={props.data} />
        </Col>
        <Col xs={12} lg={6} className="my-auto">
          <CustomTable model={props.model} columns={['gene', 'score']} />
        </Col>
      </Row>
    </div>
  );
};

export default modelEssentialitiesDetails;
