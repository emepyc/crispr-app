import { Col, Container, Jumbotron, Row } from 'reactstrap';
import React from 'react';

import Logo from '../../assets/projectScore.png';
import './depmapGenesHeader.css';

const header = () => (
  <Jumbotron className="text-center mb-3">
    <Container>
      <img src={Logo} width={'500px'} />
      <p className="lead">Genetic screens to identify cancer dependencies</p>
    </Container>
  </Jumbotron>
);

export default header;
