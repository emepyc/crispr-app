import React from 'react';
import { Col, Row } from 'reactstrap';

import FilterBox from '../filterBox';
import TissuesChips from '../tissueChip';

class Filters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tissue } = this.props;
    const tissuesFilter = <TissuesChips tissue={tissue} />;
    return (
      <div style={{ marginLeft: '10px' }}>
        <Row>
          <Col xs={3}>
            <FilterBox header={'Tissues'} body={tissuesFilter} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Filters;
