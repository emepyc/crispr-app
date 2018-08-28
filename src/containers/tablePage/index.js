import React from 'react';
import { Container } from 'reactstrap';
import CustomTable from '../customTable';
import Filters from '../filters';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import { tableTissueFilter } from '../../modules/actions/table';

import { history } from '../../store/store';

class TablePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tissue: null
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

  setParamsInUrl = (newParams, history) => {
    const oldQueryParams = queryString.parse(history.location.search);
    const newQueryParams = queryString.stringify({
      ...oldQueryParams,
      ...newParams
    });
    history.replace({
      ...history.location,
      search: newQueryParams
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.tissue === this.props.tissue) {
      return;
    }
    const { tissue } = this.props;
    this.setState({
      tissue
    });
    this.setParamsInUrl(
      {
        tissue
      },
      history
    );
  }

  getParamsFromUrl = loc => {
    const gene = this.getTerm(loc, 'gene');
    const model = this.getTerm(loc, 'model');
    const tissue = this.getTerm(loc, 'tissue');

    return pickBy({ gene, model, tissue }, identity);
  };

  componentDidMount() {
    const params = this.getParamsFromUrl(this.props.location);
    this.setState({
      tissue: params.tissue
    });
    if (params.tissue) {
      this.props.setTissue(params.tissue);
    }
  }

  render() {
    const { tissue } = this.props;
    const tissueLoc = this.state.tissue;
    return (
      <Container style={{ minHeight: '500px' }}>
        <div className="section" style={{ marginTop: '20px' }}>
          <Filters tablePage tissue={tissue || tissueLoc} />
        </div>
        <CustomTable
          tissue={tissue || tissueLoc}
          columns={['gene', 'model', 'logFC', 'lossOfFitnessScore']}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    tissue: state.tableTissue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTissue: tissue => dispatch(tableTissueFilter(tissue))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TablePage)
);
