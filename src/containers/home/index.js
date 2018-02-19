import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'reactstrap';

const Home = props => (
  <Container>
    <Row>
      <Col sm="12" md={{ size: 4, offset: 4 }}>
        <p>Welcome home!</p>
        <button onClick={() => props.changePage()}>
          Go to about page via redux
        </button>
        <Button color="danger">Danger!</Button>
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
