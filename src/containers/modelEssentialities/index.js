import React from 'react';
import { connect } from 'react-redux';

import { fetchModelEssentialities } from '../../modules/actions/modelEssentialities';
// import ModelEssentialitiesSummary from '../modelEssentialitiesSummary';
import ModelEssentialitiesDetails from '../modelEssentialitiesDetails';
import Filters from '../filters';

class ModelEssentialities extends React.Component {
  constructor(props) {
    super(props);
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
    if (this.props.hasErrored) {
      return (
        <p>
          Sorry! there was a problem loading the essentialities for{' '}
          {this.props.model}
        </p>
      );
    }

    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    const data = this.filterByScoreRange(this.props.modelEssentialities);

    return (
      <React.Fragment>
        <div className="section">
          <Filters model={this.props.model} />
        </div>
        <ModelEssentialitiesDetails
          data={data}
          gene={this.props.gene}
          model={this.props.model}
        />
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
