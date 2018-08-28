import { Col, Container, Jumbotron, Row } from 'reactstrap';
import React from 'react';

import Logo from '../../assets/projectScore.png';
import './depmapGenesHeader.css';
import 'animate.css';

const header = () => {
  return (
    <Jumbotron className="text-center mb-3">
      <Container>
        <Row className="animated fadeInDown">
          <Col md={{ size: 8, offset: 2 }} xs={12}>
            <img src={Logo} style={{ maxWidth: '100%', height: 'auto' }} />
          </Col>
        </Row>
        <p className="lead">Genetic screens to identify cancer dependencies</p>
        <p className="my-2" style={{ textAlign: 'center' }}>
          Project Score uses CRISPR-Cas9 whole genome drop out screening
          technology to identify novel oncology drug targets.
        </p>
      </Container>
    </Jumbotron>
  );
};

export default header;
