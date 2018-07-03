import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { fetchGeneInfo } from '../../modules/actions/geneInfo';
import { fetchAnalyses } from '../../modules/actions/tissues';
import {
  IsPanCancerEssential,
  SignificantCancerTypesSummary,
  SignificantEssentialitiesSummary
} from '../geneEssentialitiesSummaryPlots';

class GeneEssentialitiesSummary extends React.Component {
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

    return (
      <Row className="text-center" style={{ fontSize: '0.9rem' }}>
        <Col xs={4}>
          <SignificantEssentialitiesSummary
            essentialities={this.props.geneEssentialities}
            scoreRange={this.props.scoreRange}
            width={100}
            height={100}
          />
        </Col>
        <Col xs={4}>
          <SignificantCancerTypesSummary
            gene={this.props.geneInfo}
            analyses={this.props.analyses}
            width={100}
            height={100}
          />
        </Col>
        <Col xs={4}>
          <IsPanCancerEssential gene={this.props.geneInfo} />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  return {
    analyses: state.analyses,
    geneEssentialities: state.geneEssentialities,
    geneInfo: state.geneInfo,
    hasErrored: state.geneInfoHasErrored,
    isLoading: state.geneInfoIsLoading,
    scoreRange: state.scoreRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAnalyses: () => dispatch(fetchAnalyses()),
    fetchGeneInfo: gene => dispatch(fetchGeneInfo(gene))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  GeneEssentialitiesSummary
);
