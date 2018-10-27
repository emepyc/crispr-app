import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import axios from 'axios';
import classnames from 'classnames';
import { Promise } from 'es6-promise';
import debounce from 'lodash.debounce';
import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import React from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
  NavLink,
  Tooltip
} from 'reactstrap';

import {
  selectGene,
  selectModel,
  selectRow
} from '../../modules/actions/customTable';

import TableDisplay from '../TableDisplay';
import { scoreExtent, scoreRange } from '../../modules/actions/scoreSlider';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

function parseData(raw) {
  return raw.map(d => {
    return [
      d.attributes.gene_symbol,
      d.attributes.model_name,
      d.attributes.fc_corrected,
      d.attributes.bagel_bf_scaled
    ];
  });
}

function json2csv(json) {
  return [['Gene', 'Model', 'Score'], ...json]
    .map(row => row.join(','))
    .join('\n');
}

class CustomTable extends React.Component {
  constructor(props) {
    super(props);

    this.fetch = debounce(this.fetch, 300);

    this.maxSizeDownload = 2000;

    this.state = {
      data: [],

      // fetch state
      loading: false,
      error: null,

      // fetch options
      filter: null,
      search: null,
      searchQuery: '',
      score: null,
      pageSize: 10,
      pageNumber: 1,
      sort: 'fc_corrected',
      sortDirection: 1,
      totalHits: null,

      // tooltip
      tooltipOpen: false,

      // Download data
      download: false,
      downloadData: []
    };
  }

  combineSearchAndFilter = () => {
    const { filter, search } = this.state;
    if (filter && search) {
      return [{ and: [...filter, search] }];
    }

    return filter || search;
  };

  fetchParams = () => {
    const { sort, sortDirection, pageSize, pageNumber } = this.state;

    const searchAndFilter = this.combineSearchAndFilter();

    const params = {
      sort: sortDirection === -1 ? `-${sort}` : sort,
      filter: JSON.stringify(searchAndFilter),
      'page[size]': pageSize,
      'page[number]': pageNumber
    };

    return pickBy(params, identity);
  };

  getParamsNoScoreRange = () => {
    const { gene, model, tissue } = this.props;
    const params = {
      gene,
      model,
      tissue
    };
    return this.paramsToFilter(pickBy(params, identity));
  };

  setExtent = () => {
    // We show the table spinner when the extent is loading
    this.setState({
      loading: true
    });

    return this.getParamsNoScoreRange().then(filter => {
      return axios
        .get(`${API_BASEURL}/datasets/crispr`, {
          params: {
            sort: 'fc_corrected',
            filter: JSON.stringify(filter),
            'page[size]': 1,
            'page[number]': 1
          }
        })
        .then(resp => {
          const min = resp.data.data[0].attributes.fc_corrected;
          axios
            .get(`${API_BASEURL}/datasets/crispr`, {
              params: {
                sort: 'fc_corrected',
                filter: JSON.stringify(filter),
                'page[size]': 1,
                'page[number]': resp.data.meta.count
              }
            })
            .then(resp => {
              const max = resp.data.data[0].attributes.fc_corrected;
              this.props.setScoreExtent([min, max]);
              return this.props.setScoreRange([min, max]);
            });
        });
    });
  };

  fetch = () => {
    const params = this.fetchParams();
    this.setState({
      loading: true
    });

    axios
      .get(`${API_BASEURL}/datasets/crispr`, {
        params: { ...params }
      })
      .then(
        resp => {
          this.setState({
            loading: false,
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

  paramToFilter = (name, value) => {
    if (name === 'model') {
      return {
        name: 'model_name',
        op: 'in_',
        val: Array.isArray(value) ? value : [value]
      };
    }

    if (name === 'gene') {
      return {
        name: 'gene_symbol',
        op: 'in_',
        val: [value]
      };
    }

    if (name === 'search') {
      return {
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
    }

    if (name === 'scoreRange') {
      return {
        and: [
          {
            name: 'fc_corrected',
            op: 'le',
            val: value[1]
          },
          {
            name: 'fc_corrected',
            op: 'ge',
            val: value[0]
          }
        ]
      };
    }

    throw `Unknown filter ${name}`;
  };

  paramsToFilter = params => {
    return this.expandParams(params).then(expandedParams => {
      const { tissue, ...validParams } = expandedParams; // Tissue can not go in the filters
      return Object.keys(validParams).map(param => {
        const paramsNoEmpty = pickBy(validParams, param => param !== undefined);
        return this.paramToFilter(param, paramsNoEmpty[param]);
      });
    });
  };

  getParams = cbak => {
    const { gene, model, tissue, scoreRange } = this.props;
    const params = {
      gene,
      model,
      scoreRange,
      tissue
    };
    this.paramsToFilter(pickBy(params, identity)).then(filter => {
      this.setState(
        {
          filter: filter
        },
        cbak
      );
    });
  };

  componentDidMount() {
    this.getParams(this.setExtent);
    // this.setExtent();
  }

  rangesAreEqual(prevRange, currRange) {
    if (prevRange === currRange) {
      return true;
    }
    if (prevRange === null && currRange !== null) {
      return false;
    }
    if (prevRange !== null && currRange === null) {
      return false;
    }
    return prevRange[0] === currRange[0] && prevRange[1] === currRange[1];
  }

  componentDidUpdate(prevProps) {
    // If nothing has changed, don't fetch new data
    if (
      prevProps.tissue === this.props.tissue &&
      prevProps.gene === this.props.gene &&
      prevProps.model === this.props.model &&
      this.rangesAreEqual(prevProps.scoreRange, this.props.scoreRange)
    ) {
      return;
    }

    // If anything but the range has changed, set a new extent (a fetch is automatically triggered in the next condition because of the extent change)
    if (
      (prevProps.tissue !== this.props.tissue ||
        prevProps.gene !== this.props.gene ||
        prevProps.model !== this.props.model) &&
      this.rangesAreEqual(prevProps.scoreRange, this.props.scoreRange)
    ) {
      this.getParams(this.setExtent);
    }

    // If there is a change in anything, fetch new data
    if (!this.rangesAreEqual(prevProps.scoreRange, this.props.scoreRange)) {
      this.getParams(this.fetch);
    }
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

  search = ev => {
    const { value } = ev.target;
    this.setState({
      searchQuery: value
    });
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

    this.setState({
      pageNumber: 1
    });
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

  tooltipToggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  downloadData = () => {
    const params = {
      ...this.fetchParams(),
      'page[size]': this.maxSizeDownload,
      'page[number]': 0
    };

    axios
      .get(`${API_BASEURL}/datasets/crispr`, {
        params: { ...params }
      })
      .then(resp => {
        const downloadData = parseData(resp.data.data);
        const csv = json2csv(downloadData);
        const downloadLink = document.createElement('a');
        const blob = new Blob(['\ufeff', csv]);
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'data.csv';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        this.setState({
          download: true,
          downloadData
        });
      });
  };

  setSort = sortField => {
    this.setState(
      {
        sort: sortField,
        sortDirection:
          sortField === this.state.sort ? this.state.sortDirection * -1 : 1
      },
      () => {
        this.fetch();
      }
    );
  };

  render() {
    const {
      data,
      totalHits,
      pageNumber,
      pageSize,
      tooltipOpen,
      searchQuery,
      sort,
      sortDirection,
      loading
    } = this.state;

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
            &lt;
          </NavLink>
          <small style={{ padding: '0.75rem 0.25rem' }}>
            Page <b>{pageNumber}</b> of {1 + ~~(totalHits / pageSize)}{' '}
            <small style={{ color: '#999999' }}>({totalHits} total rows)</small>
          </small>
          <NavLink className={navNextClass} href="#" onClick={this.goNext}>
            &gt;
          </NavLink>
        </Nav>

        <div style={{ float: 'right', marginBottom: '10px' }}>
          <Button
            outline
            color="secondary"
            id="download-element"
            style={{
              display: 'inline-block',
              float: 'right',
              marginLeft: '10px'
            }}
            onClick={this.downloadData}
          >
            <FontAwesomeIcon icon={faDownload} style={{ fontSize: '1em' }} />
          </Button>
          <Tooltip
            placement="auto"
            target="download-element"
            toggle={this.tooltipToggle}
            isOpen={tooltipOpen}
          >
            Download data in CSV
            {totalHits > this.maxSizeDownload && (
              <div>
                Only the first {this.maxSizeDownload} rows (out of {totalHits})
                will be downloaded
              </div>
            )}
          </Tooltip>

          <InputGroup style={{ width: '300px' }}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Search</InputGroupText>
            </InputGroupAddon>
            <Input value={searchQuery} onChange={e => this.search(e)} />
          </InputGroup>
        </div>

        <TableDisplay
          {...this.props}
          data={data}
          sort={sort}
          sortDirection={sortDirection}
          loading={loading}
          onSortChange={this.setSort}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedEssentiality: state.rowSelected,
    scoreRange: state.scoreRange
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectRow: rowData => dispatch(selectRow(rowData)),
    selectGene: gene => dispatch(selectGene(gene)),
    selectModel: model => dispatch(selectModel(model)),
    setScoreExtent: extent => dispatch(scoreExtent([extent[0], extent[1]])),
    setScoreRange: range => dispatch(scoreRange([+range[0], +range[1]]))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
