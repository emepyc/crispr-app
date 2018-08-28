import React from 'react';
import { Row, Col } from 'reactstrap';
import DonutChart from '../donutChart';
import HomeSectionDescription from '../homeSectionDescription';
import TissuesSummaryDescription from '../tissuesSummaryDescription';

import 'animate.css';

const tissuesSummaryDisplay = () => {
  return (
    <div>
      <Row>
        <Col md={{ size: 12 }} lg={{ size: 6 }} className="animated fadeInLeft">
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
