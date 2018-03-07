import React from 'react';
import { connect } from 'react-redux';
import { fetchGeneInfo } from './actions/geneInfo';
import DisplayGeneInfo from '../displayGeneInfo';

class GeneInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchGeneInfo(this.props.gene);
  }

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was a problem loading the gene info</p>;
    }

    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <DisplayGeneInfo gene={this.props.geneInfo} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    geneInfo: state.geneInfo,
    hasErrored: state.geneInfoHasErrored,
    isLoading: state.geneInfoIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGeneInfo: gene => dispatch(fetchGeneInfo(gene))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneInfo);
