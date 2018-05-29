import React from 'react';
import { connect } from 'react-redux';
import { fetchModelEssentialities } from './actions/modelEssentialities';
import ModelEssentialitiesSummary from '../modelEssentialitiesSummary';
import ModelEssentialitiesDetails from '../modelEssentialitiesDetails';

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

  render() {
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
          <ModelEssentialitiesDetails
            model={this.props.model}
            data={this.props.modelEssentialities}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    modelEssentialities: state.modelEssentialities,
    hasErrored: state.modelEssentialitiesHasErrored,
    isLoading: state.modelEssentialitiesIsLoading
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
