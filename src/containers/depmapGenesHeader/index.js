// import { Col, Container, Jumbotron, Row } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import React from 'react';

// import Logo from '../../assets/projectScore.png';
import './depmapGenesHeader.css';
import 'animate.css';

const header = () => {
  return (
    <Jumbotron className="text-center mb-1">
      <div className="animated fadeInUp text-center">
        <h1 className="display-1" style={{ color: 'black' }}>
          DepMap | Genes
        </h1>
      </div>
      <p className="lead">Genetic screens to identify cancer dependencies</p>
      <p className="my-2" style={{ textAlign: 'center' }}>
        Project Score uses CRISPR-Cas9 whole genome drop out screening
        technology to identify novel oncology drug targets.
      </p>
    </Jumbotron>
  );
};

export default header;
