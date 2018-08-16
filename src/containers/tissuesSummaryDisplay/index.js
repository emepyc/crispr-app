import React from 'react';
import { Row, Col } from 'reactstrap';
import PieChart from '../pieChart';
import DonutChart from '../donutChart';
import HomeSectionDescription from '../homeSectionDescription';
import TissuesSummaryDescription from '../tissuesSummaryDescription';

const tissuesSummaryDisplay = () => {
  return (
    <div>
      <Row>
        <Col md={{ size: 12 }} lg={{ size: 6 }}>
          <DonutChart />
        </Col>

        <Col className={'my-auto'} md={{ size: 12 }} lg={{ size: 6 }}>
          <HomeSectionDescription>
            <TissuesSummaryDescription />
          </HomeSectionDescription>
        </Col>
      </Row>
    </div>
  );
};

export default tissuesSummaryDisplay;
