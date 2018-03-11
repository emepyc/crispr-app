import React from 'react';
import { Row, Col } from 'reactstrap';
import GeneInfo from '../geneInfo';
import GeneEssentialities from '../geneEssentialities';

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
            <GeneInfo gene={geneName} />
          </Col>
          <Col sm="12" md="10">
            <GeneEssentialities gene={geneName} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default GenePage;
