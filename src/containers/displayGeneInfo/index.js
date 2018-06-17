import isEmpty from 'lodash.isempty';
import React from 'react';
import { Link } from 'react-router-dom';

import './displayGeneInfo.css';
import UniprotLogo from '../../assets/UniprotLogo.gif';
import EnsemblLogo from '../../assets/EnsemblLogo.jpg';
import OpenTargetsLogo from '../../assets/OpenTargetsLogo.png';

function getEssentialities(attributes, analyses) {
  return Object.keys(attributes).reduce((acc, curr) => {
    const index = curr.indexOf('adm_status_');
    if (index > -1 && attributes[curr]) {
      const cancerType = curr.substr(11, curr.length - index);
      return [...acc, analyses[cancerType].label];
    }
    return acc;
  }, []);
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

function TissueLink(props) {
  const { tissue } = props;
  return (
    <Link to={`/table?tissue=${tissue.split(' ').join('_')}`}>
      <span style={{ marginLeft: '10px' }}>{tissue}</span>
    </Link>
  );
}

function ScreeningResults(props) {
  const {
    essentialInCancerTypes,
    gene,
    significantEssentialities,
    totalEssentialities
  } = props;
  console.log(props);
  return (
    <div>
      <ul>
        <li>
          {gene} is essential in {significantEssentialities} out of{' '}
          {totalEssentialities} cancer cell lines
        </li>
        <li>
          Tissues where {gene} is essential in:
          {essentialInCancerTypes.map(tissue => (
            <TissueLink key={tissue} tissue={tissue} />
          ))}
        </li>
      </ul>
    </div>
  );
}

const displayGeneInfo = props => {
  if (!props.gene.data || isEmpty(props.analyses)) {
    return <div />;
  }

  const {
    symbol: geneSymbol,
    ensembl_gene_id: ensemblId
  } = props.gene.data.attributes;

  const essentialIn = getEssentialities(
    props.gene.data.attributes,
    props.analyses
  );

  return (
    <div className="gene-info-container">
      <div style={{ marginTop: '20px' }}>
        <div className="gene-info-body">
          <div>
            <div>{props.gene.data.attributes.name}</div>
          </div>
          {/*<div style={{marginTop: "20px", float: "right"}}>*/}
          {/*<LogoExternalLink src={UniprotLogo} link={`http://www.uniprot.org/uniprot/?query=${geneSymbol}&sort=score`}*/}
          {/*width="80"/>*/}
          {/*<LogoExternalLink src={EnsemblLogo} link={`https://www.ensembl.org/gene=${ensemblId}`} width="40"/>*/}
          {/*<LogoExternalLink src={OpenTargetsLogo}*/}
          {/*link={`https://www.targetvalidation.org/target/${ensemblId}/associations`} width="40"/>*/}
          {/*</div>*/}
        </div>
        <div className="gene-info-body" style={{ marginTop: '30px' }}>
          <h4>Screening results</h4>
          <ScreeningResults
            {...props}
            essentialInCancerTypes={essentialIn}
            gene={geneSymbol}
          />
        </div>
      </div>
    </div>
  );
};

export default displayGeneInfo;
