import React from 'react';
import { connect } from 'react-redux';
import { Range } from 'rc-slider';
import { scoreRange } from '../../modules/actions/scoreSlider';

import 'rc-slider/assets/index.css';

const scoreExtent = [-9, 9];

class ScoreSlider extends React.Component {
  constructor(props) {
    super(props);
  }

  rangeChanged = value => {
    this.props.setScoreRange(value);
  };

  render() {
    return (
      <React.Fragment>
        <div>Score slider goes here</div>
        <Range
          allowCross={false}
          min={scoreExtent[0]}
          max={scoreExtent[1]}
          step={0.1}
          defaultValue={scoreExtent}
          onChange={this.rangeChanged}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    setScoreRange: range => dispatch(scoreRange(range))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreSlider);
