import React from 'react';
import { connect } from 'react-redux';
import { fetchGeneEssentialities } from './actions/geneEssentialities';
import GeneEssentialitiesSummary from '../geneEssentialitiesSummary';
import GeneEssentialitiesDetails from '../geneEssentialitiesDetails';

class GeneEssentialities extends React.Component {
  constructor(props) {
    super(props);

    this.summary = data => {
      if (!data.data) {
        return {
          models: {}
        };
      }
      const summary = {};

      // Number of models
      const modelsTotal = {};
      const modelsSignif = {};
      data.data.forEach(m => {
        const mId = m.attributes.model_name;
        if (!modelsTotal[mId]) {
          modelsTotal[mId] = 0;
        }
        modelsTotal[mId] += 1;

        if (m.attributes.mageck_fdr < 0.05) {
          if (!modelsSignif[mId]) {
            modelsSignif[mId] = 0;
          }
          modelsSignif[mId] += 1;
        }
      });
      summary.models = {
        total: Object.keys(modelsTotal).length,
        significant: Object.keys(modelsSignif).length
      };
      return summary;
    };
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
        <div>
          <GeneEssentialitiesSummary
            gene={this.props.gene}
            data={this.summary(this.props.geneEssentialities)}
          />
        </div>
        <div>
          <GeneEssentialitiesDetails
            gene={this.props.gene}
            data={this.props.geneEssentialities}
          />
        </div>
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
