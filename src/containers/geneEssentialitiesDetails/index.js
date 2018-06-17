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
        <Col xs={12} lg={6} className="my-auto">
          <GeneEssentialitiesPlot data={props.data} />
        </Col>
        <Col xs={12} lg={6} className="my-auto">
          <CustomTable
            gene={props.gene}
            tissue={props.tissue}
            columns={['model', 'score']}
          />
        </Col>
      </Row>
    </div>
  );
};

export default geneEssentialitiesDetails;
