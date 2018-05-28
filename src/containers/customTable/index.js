import React from 'react';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import { connect } from 'react-redux';
import { Table, Nav, NavLink } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import { selectRow, setGene } from './actions/customTable';
import Promise from 'es6-promise';
import { Link } from 'react-router-dom';

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
    console.warn('fetch!!!');
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

  expandParams = params => {
    if (params.tissue) {
      // TODO: this is the reverse of the process happened when fetching the tissues data. There may be better alternatives to just substituting back and forth
      const tissueClean = params.tissue.split('_').join(' ');
      return axios
        .get(
          `${API_BASEURL}/models?filter=[{"name":"tissue","op":"eq","val":"${tissueClean}"}]&page[size]=0`
        )
        .then(resp => {
          return {
            ...params,
            model: [
              ...(params.model || []),
              ...resp.data.data.map(rec => rec.attributes.model_name)
            ]
          };
        });
    }
    return Promise.resolve(params);
  };

  paramsToFilter = params => {
    return this.expandParams(params).then(expandedParams => {
      const { tissue, ...validParams } = expandedParams; // Tissue can not go in the filters
      return Object.keys(validParams).map(param => {
        return {
          name: paramToApiParam[param],
          op: 'in_',
          val: Array.isArray(expandedParams[param])
            ? [...expandedParams[param]]
            : [expandedParams[param]]
        };
      });
    });
  };

  getParams = () => {
    const { gene, tissue } = this.props;
    const params = {
      tissue,
      gene
    };
    this.paramsToFilter(pickBy(params, identity)).then(filters => {
      this.setState(
        {
          filter: JSON.stringify(filters)
        },
        this.fetch
      );
    });
  };

  componentDidMount() {
    this.getParams();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.tissue === this.props.tissue &&
      prevProps.gene === this.props.gene
    ) {
      return;
    }
    this.getParams();
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
                  <th scope="row">
                    <Link
                      onClick={() => this.props.setGene(row[0])}
                      to={`/gene/${row[0]}?model=${row[1]}`}
                    >
                      {row[0]}
                    </Link>
                  </th>
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

const mapStateToProps = state => {
  return {
    selectedEssentiality: state.rowSelected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectRow: rowData => dispatch(selectRow(rowData)),
    setGene: gene => dispatch(setGene(gene))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
