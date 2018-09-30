import React from 'react';
import { Row, Col } from 'reactstrap';

import CustomTable from '../customTable';
import GeneEssentialitiesPlot from '../geneEssentialitiesPlot';
import './geneEssentialitiesDetails.css';

const geneEssentialitiesDetails = props => {
  if (!props.data) {
    return <div />;
  }

  return (
    <div className="gene-essentialities-details-container">
      <Row>
        <Col
          xs={12}
          lg={6}
          className="my-auto"
          style={{ paddingRight: '30px' }}
        >
          <GeneEssentialitiesPlot
            data={props.data}
            model={props.model}
            gene={props.gene}
            contextPage="gene"
          />
        </Col>
        <Col xs={12} lg={6} style={{ paddingLeft: '30px' }}>
          <CustomTable
            gene={props.gene}
            tissue={props.tissue}
            columns={['model', 'logFC', 'lossOfFitnessScore']}
          />
        </Col>
      </Row>
    </div>
  );
};

export default geneEssentialitiesDetails;
