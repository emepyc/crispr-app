import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Row, Col, Container } from 'reactstrap';

import GeneInfo from '../geneInfo';
import GeneEssentialities from '../geneEssentialities';

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
    const { gene, model, tissue, scoreRange } = this.props; // This comes from the redux state
    // TODO: Encode the score range in the Location (and other parameters)
    const { gene: geneLoc, model: modelLoc } = this.state; // This comes from the component state
    return (
      <div>
        <Row>
          <Col sm="12" md="2">
            <GeneInfo gene={gene || geneLoc} />
          </Col>
          <Col sm="12" md="10">
            <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
              <GeneEssentialities
                gene={gene || geneLoc}
                model={model || modelLoc}
                tissue={tissue}
                scoreRange={scoreRange}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gene: state.gene,
    model: state.model, // TODO: THIS IS NOT BEING USED ATM
    tissue: state.tableTissue,
    scoreRange: state.scoreRange
  };
};

export default withRouter(connect(mapStateToProps)(GenePage));
// export default GenePage;
