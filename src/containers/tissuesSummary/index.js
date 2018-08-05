import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import React from 'react';
import { connect } from 'react-redux';
import { fetchTissues } from '../../modules/actions/tissues';
import TissuesSummaryDisplay from '../tissuesSummaryDisplay';

class TissuesPieChart extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.fetchTissues();
  }

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return (
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          fixedWidth
          style={{ fontSize: '2em' }}
        />
      );
    }

    return (
      <React.Fragment>
        <h3>Explore the data</h3>
        <TissuesSummaryDisplay />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    tissues: state.tissues,
    hasErrored: state.tissuesHasErrored,
    isLoading: state.tissuesIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTissues: () => dispatch(fetchTissues())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TissuesPieChart);
