import React from 'react';
import { connect } from 'react-redux';

import DisplayGeneInfo from '../displayGeneInfo';
import { fetchGeneInfo } from '../../modules/actions/geneInfo';

class GeneInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.gene) {
      this.props.fetchGeneInfo(this.props.gene);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.gene || prevProps.gene === this.props.gene) {
      return;
    }
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
