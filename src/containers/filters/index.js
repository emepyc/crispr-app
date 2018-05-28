import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import FilterBox from '../filterBox';
import TissuesChips from '../tissueChip';

class Filters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tissue } = this.props;
    // const {genePage, model, tissue} = this.getParamsFromUrl(this.props.location);
    const tissuesFilter = <TissuesChips tissue={tissue} />;
    return (
      <Container>
        <Row>
          <Col xs={3}>
            <FilterBox header={'Tissues'} body={tissuesFilter} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Filters;
