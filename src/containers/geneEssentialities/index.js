import React from 'react';
import { connect } from 'react-redux';

import { fetchGeneEssentialities } from '../../modules/actions/geneEssentialities';
import Filters from '../filters';
import GeneEssentialitiesDetails from '../geneEssentialitiesDetails';

class GeneEssentialities extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Convert to functional
    // this.summary = data => {
    //   if (!data.length) {
    //     return {
    //       models: {}
    //     };
    //   }
    //   const summary = {};
    //
    //   // Number of models
    //   const modelsTotal = {};
    //   const modelsSignif = {};
    //   data.forEach(m => {
    //     const mId = m.attributes.model_name;
    //     if (!modelsTotal[mId]) {
    //       modelsTotal[mId] = 0;
    //     }
    //     modelsTotal[mId] += 1;
    //
    //     if (m.attributes.fc_corrected < 0.05) {
    //       if (!modelsSignif[mId]) {
    //         modelsSignif[mId] = 0;
    //       }
    //       modelsSignif[mId] += 1;
    //     }
    //   });
    //   summary.models = {
    //     total: Object.keys(modelsTotal).length,
    //     significant: Object.keys(modelsSignif).length
    //   };
    //   return summary;
    // };
  }

  componentDidUpdate(prevProps) {
    // TODO: Not sure this is right
    if (
      (this.props.gene && prevProps.gene !== this.props.gene) ||
      prevProps.tissue !== this.props.tissue
    ) {
      this.props.fetchGeneEssentialities(this.props.gene, this.props.tissue);
    }
  }

  componentDidMount() {
    if (this.props.gene) {
      this.props.fetchGeneEssentialities(this.props.gene, this.props.tissue);
    }
  }

  filterByScoreRange = data => {
    const { scoreRange } = this.props;
    if (scoreRange) {
      return data.filter(
        essentiality =>
          essentiality.attributes.fc_corrected > scoreRange[0] &&
          essentiality.attributes.fc_corrected < scoreRange[1]
      );
    }
    return data;
  };

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

    const data = this.filterByScoreRange(this.props.geneEssentialities);

    return (
      <React.Fragment>
        <div className="section">
          <Filters gene={this.props.gene} tissue={this.props.tissue} />
        </div>
        <GeneEssentialitiesDetails
          data={data}
          gene={this.props.gene}
          model={this.props.model}
          tissue={this.props.tissue}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    geneEssentialities: state.geneEssentialities,
    hasErrored: state.geneEssentialitiesHasErrored,
    isLoading: state.geneEssentialitiesIsLoading,
    scoreRange: state.scoreRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGeneEssentialities: (gene, tissue) =>
      dispatch(fetchGeneEssentialities(gene, tissue))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneEssentialities);
