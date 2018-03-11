import React from 'react';
import { connect } from 'react-redux';
import { fetchGeneEssentialities } from './actions/geneEssentialities';
import { DisplayGeneEssentialitiesSummary } from './';

class GeneEssentialities extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchGeneEssentialities(this.props.gene);
  }

  render() {
    if (this.props.hasErrored) {
      return (
        <p>
          Sorry! there was a problem loading the gene essentialities for{' '}
          {this.props.gene}
        </p>
      );
    }

    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        {/*<DisplayGeneEssentialities gene={this.props.geneEssentialities} />*/}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    geneEssentialities: state.geneEssentialities,
    hasErrored: state.geneEssentialitiesHasErrored,
    isLoading: state.geneEssentialitiesIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGeneEssentialities: gene => dispatch(fetchGeneEssentialities(gene))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneEssentialities);
