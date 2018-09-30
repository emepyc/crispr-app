import React from 'react';
import { Row, Col } from 'reactstrap';

import CustomTable from '../customTable';
import GeneEssentialitiesPlot from '../geneEssentialitiesPlot';
import './modelEssentialitiesDetails.css';

const modelEssentialitiesDetails = props => {
  if (!props.data) {
    return <div />;
  }

  return (
    <div className="gene-essentialities-details-container">
      <Row>
        <Col xs={12} lg={6} className="my-auto">
          <GeneEssentialitiesPlot data={props.data} contextPage="model" />
        </Col>
        <Col xs={12} lg={6}>
          <CustomTable
            model={props.model}
            columns={['gene', 'logFC', 'lossOfFitnessScore']}
          />
        </Col>
      </Row>
    </div>
  );
};

export default modelEssentialitiesDetails;
