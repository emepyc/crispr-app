import React from 'react';
import { Row, Col } from 'reactstrap';

class GenePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const geneName = this.props.location.pathname.split('/').pop();
    return (
      <div>
        <Row>
          <Col sm="12" md="2">
            Gene info goes here
          </Col>
          <Col sm="12" md="10">
            Gene associations go here
          </Col>
        </Row>
        Gene Information for {geneName} goes here
      </div>
    );
  }
}

export default GenePage;
