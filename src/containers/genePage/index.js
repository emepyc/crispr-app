import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import { Container } from 'reactstrap';

import UniprotLogo from '../../assets/UniprotLogo.gif';
import EnsemblLogo from '../../assets/EnsemblLogo.jpg';
import OpenTargetsLogo from '../../assets/OpenTargetsLogo.png';
// import GeneInfo from '../geneInfo';
import GeneEssentialities from '../geneEssentialities';

function GeneName(props) {
  const { gene } = props;
  console.log('we need to take the name out of this gene...');
  console.log(gene);
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
    console.log('geneInfo data...');
    console.log(geneInfo.data);
    const { symbol: geneSymbol, ensembl_gene_id: ensemblId } = geneInfo.data;

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
      <React.Fragment>
        <div
          style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px' }}
        >
          <div className="section">
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
      </React.Fragment>
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
