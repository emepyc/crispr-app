import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import queryString from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ModelEssentialities from '../modelEssentialities';

function LogoExternalLink(props) {
  const { src, link, width } = props;
  return (
    <span style={{ marginRight: '15px' }}>
      <a target={'_blank'} href={link}>
        <img src={src} width={width} />
      </a>
    </span>
  );
}

function ExternalLinks(props) {
  const { modelInfo } = props;
  if (modelInfo.data) {
    const {
      cosmic_id: cosmicId,
      model_name: modelName
    } = modelInfo.data.attributes;

    return (
      <div style={{ marginTop: '10px', float: 'right' }}>
        {/*Links to model passport goes here*/}
      </div>
    );
  }

  return <div />;
}

class ModelPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gene: null,
      model: null,
      newModelFromUrl: null
    };
  }

  getTerm = (loc, type) => {
    // The term can be in the pathname (table is part of the genePage or model pages
    // or in the search (table page)
    const index = loc.pathname.indexOf(`${type}/`);
    if (index !== -1) {
      const parts = loc.pathname.split('/');
      return parts[parts.length - 1];
    }

    const search = queryString.parse(loc.search);
    return search[type];
  };

  getParamsFromUrl = loc => {
    const gene = this.getTerm(loc, 'gene');
    const model = this.getTerm(loc, 'model');
    const tissue = this.getTerm(loc, 'tissue');

    return pickBy({ gene, model, tissue }, identity);
  };

  componentDidMount() {
    const params = this.getParamsFromUrl(this.props.location);
    this.setState({
      gene: params.gene,
      model: params.model
    });

    this.props.history.listen(() => {
      this.setState({
        newModelFromUrl: this.getParamsFromUrl(this.props.history.location)
          .model
      });
    });
  }

  render() {
    const { gene, model, tissue, scoreRange, modelInfo } = this.props; // This comes from the redux state
    const { newModelFromUrl, gene: geneLoc, model: modelLoc } = this.state; // This comes from the internal state

    return (
      <div
        style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px' }}
      >
        <div
          className="section"
          style={{ borderBottom: '1px solid green', paddingBottom: '40px' }}
        >
          <ExternalLinks modelInfo={modelInfo} />

          <h2>Model: {newModelFromUrl || model || modelLoc}</h2>
        </div>
        <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
          <ModelEssentialities
            gene={gene || geneLoc}
            model={newModelFromUrl || model || modelLoc}
            tissue={tissue} // Is this needed in the model page??
            scoreRange={scoreRange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tissue: state.tableTissue,
    gene: state.gene, // TODO: THIS IS NOT BEING USED ATM
    model: state.model,
    modelInfo: state.modelInfo,
    scoreRange: state.scoreRange
  };
};

export default withRouter(connect(mapStateToProps)(ModelPage));
