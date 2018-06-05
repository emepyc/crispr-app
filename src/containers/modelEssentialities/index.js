import React from 'react';
import { connect } from 'react-redux';

import { fetchModelEssentialities } from '../../modules/actions/modelEssentialities';
import ModelEssentialitiesSummary from '../modelEssentialitiesSummary';
import ModelEssentialitiesDetails from '../modelEssentialitiesDetails';
import Filters from '../filters';

class ModelEssentialities extends React.Component {
  constructor(props) {
    super(props);

    this.summary = data => {
      if (!data.data) {
        return {
          genes: {}
        };
      }

      const summary = {};

      return summary;
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.model && prevProps.model !== this.props.model) {
      this.props.fetchModelEssentialities(this.props.model);
    }
  }

  componentDidMount() {
    if (this.props.model) {
      this.props.fetchModelEssentialities(this.props.model);
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
    const data = this.filterByScoreRange(this.props.modelEssentialities);

    if (this.props.hasErrored) {
      return (
        <p>
          Sorry! there was a problem loading the essentialities for{' '}
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
          <ModelEssentialitiesSummary
            model={this.props.model}
            data={this.summary(this.props.modelEssentialities)}
          />
        </div>
        <div>
          <Filters tissue={this.props.tissue} />
        </div>
        <div>
          <ModelEssentialitiesDetails model={this.props.model} data={data} />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    modelEssentialities: state.modelEssentialities,
    hasErrored: state.modelEssentialitiesHasErrored,
    isLoading: state.modelEssentialitiesIsLoading,
    scoreRange: state.scoreRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchModelEssentialities: model => dispatch(fetchModelEssentialities(model))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ModelEssentialities
);
