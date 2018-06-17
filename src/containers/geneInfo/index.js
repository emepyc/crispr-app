import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { connect } from 'react-redux';

import DisplayGeneInfo from '../displayGeneInfo';
import { fetchGeneInfo } from '../../modules/actions/geneInfo';
import { fetchAnalyses } from '../../modules/actions/tissues';

class GeneInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isEmpty(this.props.analyses)) {
      this.props.fetchAnalyses();
    }
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
      return (
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          fixedWidth
          style={{ fontSize: '2em' }}
        />
      );
    }

    const significantEssentialities = this.props.geneEssentialities.filter(
      essentiality => essentiality.attributes.fc_corrected < 0
    );

    return (
      <div>
        <DisplayGeneInfo
          totalEssentialities={this.props.geneEssentialities.length}
          significantEssentialities={significantEssentialities.length}
          gene={this.props.geneInfo}
          analyses={this.props.analyses}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    analyses: state.analyses,
    analysesHasErrored: state.analysesHasErrored,
    analysesIsLoading: state.analysesIsLoading,
    geneEssentialities: state.geneEssentialities,
    geneInfo: state.geneInfo,
    hasErrored: state.geneInfoHasErrored,
    isLoading: state.geneInfoIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAnalyses: () => dispatch(fetchAnalyses()),
    fetchGeneInfo: gene => dispatch(fetchGeneInfo(gene))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneInfo);
