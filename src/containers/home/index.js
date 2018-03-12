import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Searchbox from '../searchbox';
import DepmapGenesHeader from '../depmapGenesHeader';
// import TissuesSummary from '../tissuesSummary';
import HomeSummaries from '../homeSummaries';

const Home = () => (
  <Container>
    <Row>
      <Col sm="12" md={{ size: 12, offset: 0 }}>
        <DepmapGenesHeader className="text-center" />
        <Searchbox />
        <HomeSummaries />
        {/*<TissuesSummary />*/}
      </Col>
    </Row>
  </Container>
);

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push('/about-us')
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Home);
