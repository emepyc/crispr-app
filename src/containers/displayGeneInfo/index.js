import isEmpty from 'lodash.isempty';
import React from 'react';
import { Link } from 'react-router-dom';

import './displayGeneInfo.css';

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

  const { symbol: geneSymbol } = props.gene.data.attributes;

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
