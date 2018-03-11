import React from 'react';
import Card from '../card';
import displayGeneInfoCss from './displayGeneInfo.css';

const displayGeneInfo = props => {
  if (!props.gene.data) {
    return <div />;
  }
  const header = (
    <span className="gene-info-header">
      {props.gene.data.attributes.symbol}
    </span>
  );
  const body = (
    <div className="gene-info-body">
      <div className="gene-info-section">
        <div>{props.gene.data.attributes.gene_family}</div>
      </div>
      <div className="gene-info-section">
        <div className="gene-info-section-header">External links:</div>
        <div>
          <a
            target="_blank"
            href={
              'http://www.uniprot.org/uniprot/?query=' +
              props.gene.data.attributes.symbol +
              '&sort=score'
            }
          >
            UniProt
          </a>
        </div>
        <div>
          <a
            target="_blank"
            href={
              'https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' +
              props.gene.data.attributes.ensembl_gene_id
            }
          >
            Ensembl
          </a>
        </div>
        <div>
          <a
            target="_blank"
            href={
              'https://www.targetvalidation.org/target/' +
              props.gene.data.attributes.ensembl_gene_id
            }
          >
            Open Targets
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="gene-info-container">
      <Card header={header} body={body} />
    </div>
  );
};

export default displayGeneInfo;
