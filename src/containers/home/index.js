import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Searchbox from '../searchbox';
import DepmapGenesHeader from '../depmapGenesHeader';
import TissuesPieChart from '../tissuesPiechart';

const Home = props => (
  <Container>
    <Row>
      <Col sm="12" md={{ size: 8, offset: 2 }} className="text-center">
        <DepmapGenesHeader />
        <Searchbox />

        <TissuesPieChart />
        {/*<p>Welcome home!</p>*/}
        {/*<button onClick={() => props.changePage()}>*/}
        {/*Go to about page via redux*/}
        {/*</button>*/}
        {/*<Button color="danger">Danger!</Button>*/}
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
