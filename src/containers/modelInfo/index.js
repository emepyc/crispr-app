import React from 'react';

import { connect } from 'react-redux';

import DisplayModelInfo from '../displayModelInfo';
import { fetchModelInfo } from '../../modules/actions/modelInfo';

class ModelInfo extends React.Component {
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
      return <p>Loading...</p>;
    }

    console.log(this.props);
    return (
      <div>
        <DisplayModelInfo model={this.props.modelInfo} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    modelInfo: state.modelInfo,
    hasErrored: state.geneInfoHasErrored,
    isLoading: state.modelInfoIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchModelInfo: model => dispatch(fetchModelInfo(model))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelInfo);
