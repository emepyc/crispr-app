import React from 'react';
import { connect } from 'react-redux';
import { fetchGeneEssentialities } from './actions/geneEssentialities';
import GeneEssentialitiesSummary from '../geneEssentialitiesSummary';
import GeneEssentialitiesDetails from '../geneEssentialitiesDetails';
import Filters from '../filters';

class GeneEssentialities extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Convert to functional
    this.summary = data => {
      if (!data.length) {
        return {
          models: {}
        };
      }
      const summary = {};

      // Number of models
      const modelsTotal = {};
      const modelsSignif = {};
      data.forEach(m => {
        const mId = m.attributes.model_name;
        if (!modelsTotal[mId]) {
          modelsTotal[mId] = 0;
        }
        modelsTotal[mId] += 1;

        if (m.attributes.fc_corrected < 0.05) {
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

  componentDidUpdate(prevProps) {
    if (this.props.gene && prevProps.gene !== this.props.gene) {
      this.props.fetchGeneEssentialities(this.props.gene, this.props.tissue);
    }

    if (this.props.tissue && prevProps.tissue !== this.props.tissue) {
      this.props.fetchGeneEssentialities(this.props.gene, this.props.tissue);
    }
  }

  componentDidMount() {
    if (this.props.gene) {
      this.props.fetchGeneEssentialities(this.props.gene, this.props.tissue);
    }
  }

  render() {
    if (this.props.hasErrored) {
      return (
        <p>
          Sorry! there was a problem loading the gene essentialities for
          {this.props.gene}
        </p>
      );
    }

    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <React.Fragment>
        <div>
          <GeneEssentialitiesSummary
            gene={this.props.gene}
            data={this.summary(this.props.geneEssentialities)}
          />
        </div>
        <div>
          <Filters tissue={this.props.tissue} />
        </div>
        <div>
          <GeneEssentialitiesDetails
            gene={this.props.gene}
            model={this.props.model}
            tissue={this.props.tissue}
            data={this.props.geneEssentialities}
          />
        </div>
      </React.Fragment>
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
    fetchGeneEssentialities: (gene, tissue) =>
      dispatch(fetchGeneEssentialities(gene, tissue))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneEssentialities);
