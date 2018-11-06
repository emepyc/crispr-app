import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import UniprotLogo from '../../assets/UniprotLogo.gif';
import EnsemblLogo from '../../assets/EnsemblLogo.jpg';
import OpenTargetsLogo from '../../assets/OpenTargetsLogo.png';
import GeneCardsLogo from '../../assets/logo_genecards.png';
import GeneEssentialities from '../geneEssentialities';
import { getParamsFromUrl } from '../../utils';
import { Tooltip } from 'reactstrap';

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
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px', verticalAlign: 'middle' }}>
          Link to:{' '}
        </span>
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
        <LogoExternalLink
          src={GeneCardsLogo}
          link={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${geneSymbol}`}
          width="80"
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
      model: null,
      newGeneFromUrl: null
    };
  }

  componentDidMount() {
    const params = getParamsFromUrl(this.props.location);
    this.setState({
      gene: params.gene,
      model: params.model
    });

    this.props.history.listen(() => {
      this.setState({
        newGeneFromUrl: getParamsFromUrl(this.props.history.location).gene
      });
    });
  }

  render() {
    const { gene, model, tissue, scoreRange, geneInfo } = this.props; // This comes from the redux state
    // TODO: Encode the score range in the Location? (and other parameters)
    const { newGeneFromUrl, gene: geneLoc, model: modelLoc } = this.state; // This comes from the component state

    return (
      <div
        style={{ marginTop: '20px', marginLeft: '40px', marginRight: '40px' }}
      >
        <div
          className="section"
          style={{ borderBottom: '1px solid green', paddingBottom: '20px' }}
        >
          <ExternalLinks geneInfo={geneInfo} />

          <h2>Gene: {newGeneFromUrl || gene || geneLoc}</h2>
          <GeneName gene={geneInfo} />
        </div>
        <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
          <GeneEssentialities
            gene={newGeneFromUrl || gene || geneLoc}
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
