import axios from 'axios';
import classnames from 'classnames';
import Promise from 'es6-promise';
import debounce from 'lodash.debounce';
import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Table,
  Nav,
  NavLink,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

import { selectRow, setGene, setModel } from './actions/customTable';

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
      d.attributes.fc_corrected,
      d.index
    ];
  });
}

class CustomTable extends React.Component {
  constructor(props) {
    super(props);

    this.fetch = debounce(this.fetch, 300);

    this.state = {
      data: [],

      // fetch state
      loading: false,
      error: null,

      // fetch options
      filter: null,
      search: null,
      pageSize: 10,
      pageNumber: 1,
      sort: 'fc_corrected',
      totalHits: null
    };
  }

  combineSearchAndFilter = () => {
    const { filter, search } = this.state;

    if (filter && search) {
      return [{ and: [...filter, search] }];
    }

    return filter || search;
  };

  fetch = () => {
    const { sort, filter, pageSize, pageNumber, search } = this.state;
    console.warn('fetch!!!');

    const searchAndFilter = this.combineSearchAndFilter();

    const params = {
      sort,
      filter: JSON.stringify(searchAndFilter),
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
    const { gene, model, tissue } = this.props;
    const params = {
      gene,
      model,
      tissue
    };
    this.paramsToFilter(pickBy(params, identity)).then(filter => {
      this.setState(
        {
          filter: filter
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
      prevProps.gene === this.props.gene &&
      prevProps.model === this.props.model
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

  search = ev => {
    const { value } = ev.target;
    if (!value.length) {
      this.setState(
        {
          search: null
        },
        this.fetch
      );

      return;
    }

    if (value.length < 3) {
      return;
    }

    const searchFilter = {
      or: [
        {
          name: 'model_name',
          op: 'contains',
          val: value
        },
        {
          name: 'gene_symbol',
          op: 'contains',
          val: value
        }
      ]
    };

    this.setState(
      {
        search: searchFilter
      },
      this.fetch
    );
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
        <Nav style={{ float: 'left' }}>
          <NavLink className={navPrevClass} href="#" onClick={this.goPrev}>
            Previous
          </NavLink>
          <NavLink className={navNextClass} href="#" onClick={this.goNext}>
            Next
          </NavLink>
        </Nav>
        <InputGroup style={{ width: '300px', float: 'right' }}>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Search</InputGroupText>
          </InputGroupAddon>
          <Input onChange={e => this.search(e)} />
        </InputGroup>
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
                  <td>
                    <Link
                      onClick={() => this.props.setModel(row[1])}
                      to={`/model/${row[1]}?gene=${row[0]}`}
                    >
                      {row[1]}
                    </Link>
                  </td>
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
    setGene: gene => dispatch(setGene(gene)),
    setModel: model => dispatch(setModel(model))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
