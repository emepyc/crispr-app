import React from 'react';
import { Col, Row } from 'reactstrap';

import FilterBox from '../filterBox';
import GeneEssentialitiesSummary from '../geneEssentialitiesSummary';
import ScoreSlider from '../scoreSlider';
import TissuesChips from '../tissueChip';

class Filters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tissue } = this.props;
    const tissuesFilter = <TissuesChips tissue={tissue} />;
    const scoreFilter = <ScoreSlider />;
    return (
      <div style={{ marginLeft: '10px' }}>
        <Row>
          <Col xs={12} lg={6}>
            <GeneEssentialitiesSummary {...this.props} />
          </Col>
          <Col xs={6} lg={3}>
            <FilterBox header={'Tissues'} body={tissuesFilter} />
          </Col>
          <Col xs={6} lg={3}>
            <FilterBox header={'Score'} body={scoreFilter} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Filters;
