import React from 'react';
import { connect } from 'react-redux';
import { fetchTissues } from './actions/tissues';

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
      return <p>Loading...</p>;
    }

    return (
      <div>
        Pie chart for tissues goes here
        {/*<PieChart tissues={tissues} />*/}
        <ul>
          {this.props.tissues.map(tissue => (
            <li key={tissue.tissue}>
              {tissue.tissue}:{tissue.counts}
            </li>
          ))}
        </ul>
      </div>
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
// export default TissuesPieChart;
