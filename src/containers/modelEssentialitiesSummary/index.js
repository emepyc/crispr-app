import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { fetchModelInfo } from '../../modules/actions/modelInfo';
import { SignificantEssentialitiesSummary } from '../modelEssentialitiesSummaryPlots';

class ModelEssentialitiesSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.model) {
      this.props.fetchModelInfo(this.props.model);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.model || prevProps.model === this.props.model) {
      return;
    }
    this.props.fetchModelInfo(this.props.model);
  }

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was a problem loading the model info</p>;
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
            essentialities={this.props.modelEssentialities}
            scoreRange={this.props.scoreRange}
            width={100}
            height={100}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  return {
    modelEssentialities: state.modelEssentialities,
    modelInfo: state.modelInfo,
    hasErrored: state.modelInfoHasErrored,
    isLoading: state.modelInfoIsLoading,
    scoreRange: state.scoreRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchModelInfo: gene => dispatch(fetchModelInfo(gene))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ModelEssentialitiesSummary
);
