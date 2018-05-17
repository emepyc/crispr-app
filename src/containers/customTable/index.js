import React from 'react';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { connect } from 'react-redux';
import { Table, Nav, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
// import cols from './columns';
import { withRouter } from 'react-router';
import { selectRow } from './actions/customTable';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

const paramToApiParam = {
  gene: 'gene_symbol',
  model: 'model_name'
};

function parseData(raw) {
  return raw.map(d => {
    return [
      d.attributes.gene_symbol,
      d.attributes.model_name,
      d.attributes.fc_corrected
    ];
  });
}

class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],

      // fetch state
      loading: false,
      error: null,

      // fetch options
      filter: '',
      pageSize: 10,
      pageNumber: 1,
      sort: 'fc_corrected',
      totalHits: null
    };
  }

  fetch = () => {
    const { sort, filter, pageSize, pageNumber } = this.state;
    const params = {
      sort,
      filter,
      'page[size]': pageSize,
      'page[number]': pageNumber
    };

    const paramsNoEmpty = pickBy(params, identity);

    this.setState({
      isLoading: true
    });

    axios
      .get(`${API_BASEURL}/datasets/crispr`, {
        params: { ...paramsNoEmpty }
      })
      .then(
        resp => {
          this.setState({
            isLoading: false,
            data: parseData(resp.data.data),
            totalHits: resp.data.meta.count
          });
        },
        error => {
          this.setState({
            error
          });
        }
      );
  };

  getTerm = (pathname, type) => {
    const index = pathname.indexOf(`${type}/`);
    if (index !== -1) {
      const parts = pathname.split('/');
      return parts[parts.length - 1];
    }
  };

  paramsToFilter = params => {
    return Object.keys(params).map(param => {
      return {
        name: paramToApiParam[param],
        op: 'in_',
        val: [params[param]]
      };
    });
  };

  getParamsFromUrl = loc => {
    const gene = this.getTerm(loc.pathname, 'gene');
    const model = this.getTerm(loc.pathname, 'model');

    return pickBy({ gene, model }, identity);
  };

  componentDidMount() {
    const params = this.getParamsFromUrl(this.props.location);
    const filter = this.paramsToFilter(params);
    this.setState(
      {
        filter: JSON.stringify(filter)
      },
      this.fetch
    );
  }

  componentWillUnmount() {
    this.props.selectRow(null);
  }

  goPrev = () => {
    if (!this.isFirstPage()) {
      this.setState(
        {
          pageNumber: this.state.pageNumber - 1
        },
        this.fetch
      );
    }
  };

  goNext = () => {
    if (!this.isLastPage()) {
      this.setState(
        {
          pageNumber: this.state.pageNumber + 1
        },
        this.fetch
      );
    }
  };

  isFirstPage = () => this.state.pageNumber === 1;
  isLastPage = () =>
    this.state.pageNumber >= this.state.totalHits / this.state.pageSize;

  mouseOver = rowData => {
    this.props.selectRow(rowData);
  };

  render() {
    const { data } = this.state;
    const { selectedEssentiality } = this.props;

    const navPrevClass = classnames({
      disabled: this.isFirstPage()
    });
    const navNextClass = classnames({
      disabled: this.isLastPage()
    });

    return (
      <div className="essentialities-table">
        <Nav>
          <NavLink className={navPrevClass} href="#" onClick={this.goPrev}>
            Previous
          </NavLink>
          <NavLink className={navNextClass} href="#" onClick={this.goNext}>
            Next
          </NavLink>
        </Nav>
        <Table responsive>
          <thead>
            <tr>
              <th>Gene</th>
              <th>Model</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => {
              const style = {
                backgroundColor:
                  selectedEssentiality &&
                  (selectedEssentiality[0] === row[0] &&
                    selectedEssentiality[1] === row[1])
                    ? '#eeeeee'
                    : '#ffffff'
              };
              return (
                <tr
                  key={`${row[0]}-${row[1]}`}
                  style={style}
                  onMouseOver={() => this.mouseOver(row)}
                >
                  <th scope="row">{row[0]}</th>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     ntissues: state.tissues.length,
//     nmodels: d3.sum(state.tissues, t => t.counts)
//   };
// };

const mapStateToProps = state => {
  return {
    selectedEssentiality: state.rowSelected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectRow: rowData => dispatch(selectRow(rowData))
  };
};

const CustomTableWithRouter = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomTable)
);
export default CustomTableWithRouter;

// export default connect(mapStateToProps)(Table);
