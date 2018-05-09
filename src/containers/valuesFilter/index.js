import React from 'react';
import { connect } from 'react-redux';

class valuesFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p>...</p>;
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(valuesFilter);
