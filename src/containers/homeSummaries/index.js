import React from 'react';
import Card from '../card';
import { Row, Col } from 'reactstrap';
import TissuesSummary from '../tissuesSummary';

const homeSummaries = () => {
  const genesContainerHeader = <span>Genes</span>;
  const genesContainerBody = <Row />;

  const genesCard = (
    <Card header={genesContainerHeader} body={genesContainerBody} />
  );

  return (
    <div>
      <Row className="stats-container">
        <Col xs="12" lg="6">
          <TissuesSummary />
        </Col>
        <Col xs="12" lg="6">
          {genesCard}
        </Col>
      </Row>
    </div>
  );
};

export default homeSummaries;
