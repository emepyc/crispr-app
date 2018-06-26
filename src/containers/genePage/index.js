import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import UniprotLogo from '../../assets/UniprotLogo.gif';
import EnsemblLogo from '../../assets/EnsemblLogo.jpg';
import OpenTargetsLogo from '../../assets/OpenTargetsLogo.png';
import GeneEssentialities from '../geneEssentialities';

function GeneName(props) {
  const { gene } = props;
  if (!gene.data) {
    return <div />;
  }
  return <div>{gene.data.attributes.name}</div>;
}

function LogoExternalLink(props) {
  const { src, link, width } = props;
  return (
    <span style={{ marginRight: '15px' }}>
      <a target="_blank" href={link}>
        <img src={src} width={width} />
      </a>
    </span>
  );
}

function ExternalLinks(props) {
  const { geneInfo } = props;
  if (geneInfo.data) {
    const {
      symbol: geneSymbol,
      ensembl_gene_id: ensemblId
    } = geneInfo.data.attributes;

    return (
      <div style={{ marginTop: '20px', float: 'right' }}>
        <LogoExternalLink
          src={UniprotLogo}
          link={`http://www.uniprot.org/uniprot/?query=${geneSymbol}&sort=score`}
          width="80"
        />
        <LogoExternalLink
          src={EnsemblLogo}
          link={`https://www.ensembl.org/gene=${ensemblId}`}
          width="40"
        />
        <LogoExternalLink
          src={OpenTargetsLogo}
          link={`https://www.targetvalidation.org/target/${ensemblId}/associations`}
          width="40"
        />
      </div>
    );
  }
  return <div />;
}

class GenePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gene: null,
      model: null
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
    // TODO: Include reading the range from the url

    return pickBy({ gene, model, tissue }, identity);
  };

  componentDidMount() {
    const params = this.getParamsFromUrl(this.props.location);
    this.setState({
      gene: params.gene,
      model: params.model
    });
  }

  render() {
    const { gene, model, tissue, scoreRange, geneInfo } = this.props; // This comes from the redux state
    // TODO: Encode the score range in the Location (and other parameters)
    const { gene: geneLoc, model: modelLoc } = this.state; // This comes from the component state

    return (
      <div
        style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px' }}
      >
        <div
          className="section"
          style={{ borderBottom: '1px solid green', paddingBottom: '20px' }}
        >
          <ExternalLinks geneInfo={geneInfo} />

          <h2>Gene: {gene || geneLoc}</h2>
          <GeneName gene={geneInfo} />
        </div>
        <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
          <GeneEssentialities
            gene={gene || geneLoc}
            model={model || modelLoc}
            tissue={tissue}
            scoreRange={scoreRange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gene: state.gene,
    geneInfo: state.geneInfo,
    model: state.model, // TODO: THIS IS NOT BEING USED ATM
    tissue: state.tableTissue,
    scoreRange: state.scoreRange
  };
};

export default withRouter(connect(mapStateToProps)(GenePage));
