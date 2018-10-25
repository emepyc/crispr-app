import React from 'react';
import { connect } from 'react-redux';

import { fetchGeneEssentialities } from '../../modules/actions/geneEssentialities';
import Filters from '../filters';
import GeneEssentialitiesDetails from '../geneEssentialitiesDetails';

class GeneEssentialities extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    // TODO: Check this is correct
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
          essentiality.attributes.fc_corrected >= scoreRange[0] &&
          essentiality.attributes.fc_corrected <= scoreRange[1]
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
