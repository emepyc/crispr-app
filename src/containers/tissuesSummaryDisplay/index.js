import React from 'react';
import { Row, Col } from 'reactstrap';
import DonutChart from '../donutChart';
import HomeSectionDescription from '../homeSectionDescription';
import TissuesSummaryDescription from '../tissuesSummaryDescription';
import FadeIn from '../FadeIn';

const TrackedComponent = ({ visibilityClasses, visibilityStyles }) => {
  return (
    <Row>
      <Col
        md={{ size: 12 }}
        lg={{ size: 6 }}
        className={visibilityClasses}
        style={visibilityStyles}
      >
        <DonutChart />
      </Col>

      <Col className={'my-auto'} md={{ size: 12 }} lg={{ size: 6 }}>
        <HomeSectionDescription>
          <TissuesSummaryDescription />
        </HomeSectionDescription>
      </Col>
    </Row>
  );
};

const TissuesSummaryDisplay = () => (
  <FadeIn action="fadeInLeft">
    <TrackedComponent />
  </FadeIn>
);

export default TissuesSummaryDisplay;
