import React from 'react';
import { Row, Col } from 'reactstrap';
import Searchbox from '../searchbox';
import DepmapGenesHeader from '../depmapGenesHeader';
import HomeSection from '../homeSection';
import TissuesSummary from '../tissuesSummary';

const Home = () => (
  <Row>
    <Col xs="12" md={{ size: 12, offset: 0 }}>
      <HomeSection
        customClass={'home-backdrop'}
        customStyle={{ padding: '100px 25px 100px 25px' }}
      >
        <DepmapGenesHeader className="text-center" />
        <Searchbox />
      </HomeSection>

      <HomeSection>
        <TissuesSummary />
      </HomeSection>
    </Col>
  </Row>
);

export default Home;
