import React from 'react';
import { Row, Col } from 'reactstrap';
import DonutChart from '../donutChart';
import HomeSectionDescription from '../homeSectionDescription';
import TissuesSummaryDescription from '../tissuesSummaryDescription';
import classnames from 'classnames';
import TrackVisibility from 'react-on-screen';

import 'animate.css';

const TrackedComponent = ({ isVisible }) => {
  const visibilityClasses = isVisible
    ? classnames({
        animated: true,
        fadeInLeft: true
      })
    : {};

  const visibilityStyles = !isVisible
    ? {
        visibility: 'hidden'
      }
    : {};

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
  <TrackVisibility partialVisibility once>
    <TrackedComponent />
  </TrackVisibility>
);

export default TissuesSummaryDisplay;
