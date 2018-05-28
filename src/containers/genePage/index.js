import React from 'react';
import { Row, Col } from 'reactstrap';
import GeneInfo from '../geneInfo';
import GeneEssentialities from '../geneEssentialities';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import queryString from 'query-string';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';

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
    console.log('gene taken from url...');
    console.log(gene);
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
  }

  render() {
    // const geneName = this.props.location.pathname.split('/').pop();
    const { gene, model, tissue } = this.props; // This comes from the redux state
    const { gene: geneLoc, model: modelLoc } = this.state; // This comes from the internal state
    console.log(`in gene page gene is ${gene || geneLoc}`);
    return (
      <div>
        <Row>
          <Col sm="12" md="2">
            <GeneInfo gene={gene || geneLoc} />
          </Col>
          <Col sm="12" md="10">
            <GeneEssentialities
              gene={gene || geneLoc}
              model={model || modelLoc}
              tissue={tissue}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tissue: state.tableTissue,
    gene: state.gene
  };
};

export default withRouter(connect(mapStateToProps)(GenePage));
// export default GenePage;