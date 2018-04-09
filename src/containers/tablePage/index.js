import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import queryString from 'query-string';
// import {push} from 'react-router-redux';
// import {connect} from 'react-redux';
import Table from '../table';

const TablePage = props => {
  const parsedLoc = queryString.parse(props.location.search);
  const tissue = parsedLoc.tissue;
  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 12, offset: 0 }}>
          <Table tissue={tissue} />
        </Col>
      </Row>
    </Container>
  );
};

export default TablePage;
