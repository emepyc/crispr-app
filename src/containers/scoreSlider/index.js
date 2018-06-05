import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'reactstrap';
import orderBy from 'lodash.orderby';
import identity from 'lodash.identity';
import { Range } from 'rc-slider';

import { scoreRange } from '../../modules/actions/scoreSlider';

import 'rc-slider/assets/index.css';

const scoreExtent = [-9, 9];

class ScoreSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingMinScore: false,
      editingMaxScore: false
    };
  }

  rangeChanged = value => {
    this.props.setScoreRange(value);
  };

  inputMinScore = ev => {
    const newVal = +ev.target.value;
    const newRange = orderBy([newVal, this.props.scoreRange[1]], identity);
    if (newRange[0] < newRange[1]) {
      this.props.setScoreRange(newRange);
    }
    this.setState({
      editingMinScore: false
    });
  };

  inputMaxScore = ev => {
    const newVal = +ev.target.value;
    const newRange = orderBy([this.props.scoreRange[0], newVal], identity);
    if (newRange[0] < newRange[1]) {
      this.props.setScoreRange(newRange);
    }
    this.setState({
      editingMaxScore: false
    });
  };

  startEditingScore = index => {
    if (index === 0) {
      this.setState({
        editingMinScore: true
      });
    } else if (index === 1) {
      this.setState({
        editingMaxScore: true
      });
    }
  };

  render() {
    const { scoreRange } = this.props;
    const { editingMinScore, editingMaxScore } = this.state;

    const inputStyle = {
      display: 'inline',
      fontSize: '0.8em',
      marginLeft: '10px',
      marginRight: '10px',
      width: '50px'
    };

    const rangeStyle = Object.assign({}, inputStyle, {
      cursor: 'pointer',
      border: '1px solid #ced4da',
      padding: '0.375rem 0.75rem',
      lineHeight: '1.5',
      borderRadius: '.25rem'
    });

    return (
      <React.Fragment>
        <Range
          allowCross={false}
          min={scoreExtent[0]}
          max={scoreExtent[1]}
          value={scoreRange || scoreExtent}
          step={0.1}
          defaultValue={scoreExtent}
          onChange={this.rangeChanged}
        />
        {scoreRange && (
          <div>
            Score ranging from
            {!editingMinScore && (
              <span
                style={rangeStyle}
                onClick={() => this.startEditingScore(0)}
              >
                {scoreRange[0]}
              </span>
            )}
            {editingMinScore && (
              <Input
                autoFocus
                style={inputStyle}
                onChange={() => {}}
                onBlur={this.inputMinScore}
                placeholder={scoreRange[0]}
              />
            )}
            to
            {!editingMaxScore && (
              <span
                style={rangeStyle}
                onClick={() => this.startEditingScore(1)}
              >
                {scoreRange[1]}
              </span>
            )}
            {editingMaxScore && (
              <Input
                autoFocus
                style={inputStyle}
                onChange={() => {}}
                onBlur={this.inputMaxScore}
                placeholder={scoreRange[1]}
              />
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    scoreRange: state.scoreRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setScoreRange: range => dispatch(scoreRange(range))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreSlider);
