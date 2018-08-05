import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HomeSectionDescription from '../homeSectionDescription';

const HomeProjectDescription = () => (
  <React.Fragment>
    <h3>About us</h3>
    <Container style={{ marginTop: '30px' }}>
      <Row>
        <Col xs={12} sm={4}>
          <HomeSectionDescription>
            We performed genome-scale CRISPR-Cas9 screens in ~200 human cancer
            cell lines from 12 cancer types
          </HomeSectionDescription>
        </Col>
        <Col xs={12} sm={4}>
          <HomeSectionDescription>
            We identified core fitness genes, providing insights into important
            cellular processes
          </HomeSectionDescription>
        </Col>
        <Col xs={12} sm={4}>
          <HomeSectionDescription>
            We identified fitness genes is specific sub-groups of cancer cell
            lines
          </HomeSectionDescription>
        </Col>
      </Row>
    </Container>
  </React.Fragment>
);

export default HomeProjectDescription;
