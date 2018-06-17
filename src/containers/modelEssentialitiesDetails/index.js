import React from 'react';
import { Row, Col } from 'reactstrap';
import Card from '../card';
import './modelEssentialitiesDetails.css';
import GeneEssentialitiesPlot from '../geneEssentialitiesPlot';
import CustomTable from '../customTable';

const modelEssentialitiesDetails = props => {
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
          <CustomTable model={props.model} columns={['gene', 'score']} />
        </Col>
      </Row>
    </div>
  );
};

export default modelEssentialitiesDetails;
