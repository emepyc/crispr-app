import React from 'react';
import { connect } from 'react-redux';
// import {tableStartChanged, tableTissueFilter} from './actions/table';
import { Link } from 'react-router-dom';
import { tableTissueFilter } from './actions/table';
import { Row, Col, Card } from 'reactstrap';
import $ from 'jquery';
import axios from 'axios';
import cols from './columns';
import { history } from '../../store/store';
import queryString from 'query-string';
import FilterBox from '../filterBox';
import TissuesChips from '../tissueChip';
import ValuesFilter from '../valuesFilter';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import dt from 'datatables.net';
import * as dtbs from 'datatables.net-bs4';
import * as dtbsb from 'datatables.net-buttons-bs4';
import * as dtbsr from 'datatables.net-responsive-bs4';
import 'datatables.net-keytable-bs4/css/keyTable.bootstrap4.min.css';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
// TODO: Not working on pagination buttons??
// import 'datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css';
import './table.css';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

function formatData(data) {
  const rows = [];
  data.forEach(r => {
    const row = [];

    // gene
    row.push(
      `<Link to=/gene/${r.attributes.gene_symbol}?model=${
        r.attributes.model_name
      }>
        ${r.attributes.gene_symbol}
      </Link>`
      // `<a href=/gene/${r.attributes.gene_symbol}?model=${r.attributes.model_name}>${
      //   r.attributes.gene_symbol
      // }</a>`
    );

    // model
    row.push(r.attributes.model_name);

    // value
    row.push(r.attributes.bagel_bf_scaled);

    rows.push(row);
  });

  return rows;
}

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      table: null,
      isLoading: false,
      start: 0
    };
  }

  download() {
    console.log('downloading!!');
    console.log(this.state.table);
    console.log(this.props.tissue);
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { tissue, start } = queryString.parse(history.location.search);
    const startInt = ~~start;
    // this.props.changeStart(startInt);
    this.setState({
      start: startInt
    });

    // If the tissue is already in the state, sync with URL
    if (this.props.tissue) {
      setParamsInUrl(
        {
          tissue: this.props.tissue
        },
        history
      );
    }

    // It tissue is in URL, sync with state
    if (tissue) {
      this.props.setTissue(tissue);
    }

    const table = $(this.refs.main).DataTable({
      paging: true,
      pagingType: 'simple',
      displayStart: startInt,
      buttons: [
        {
          // extend: 'csv',
          text:
            "<span class='fa fa-download' title='Download as CSV'>Download <FontAwesomeIcon icon={faDownload} /></span>",
          // text: <span><FontAwesomeIcon icon={faDownload} /></span>,
          action: () => this.download()
        }
      ],
      destroy: true,
      // dom: '<"clearfix" <"clear small" i><"pull-left small" f><"pull-right"B>rt<"pull-left small" l><"pull-right small" p>>',
      dom:
        '<"clearfix" <"clear small" i><"pull-left small" f><"pull-right dom-table-header" B>tr<"pull-left small" l><"pull-right small" p>>',
      // dom: '<"data-table-wrapper"t>',
      columns: cols,
      ordering: true,
      searchDelay: 400,
      order: [2, 'desc'],
      orderMulti: false,
      lengthMenu: [[10, 50, 200, 500], [10, 50, 200, 500]],
      processing: true,
      serverSide: true,
      language: {
        // "lengthMenu": "Display _MENU_ records per page",
        zeroRecords: 'Nothing found - sorry',
        info: 'Showing _START_ to _END_ of _TOTAL_ target - model pairs'
      },
      ajax: (opts, cbak) => {
        const { tissue } = queryString.parse(history.location.search);
        // const tissue = this.props.tissue;

        let promise = Promise.resolve(() => {});
        if (tissue) {
          // TODO: this is the reverse of the process happened when fetching the tissues data. There may be better alternatives to just substituting back and forth
          const tissueClean = tissue.split('_').join(' ');
          promise = axios
            .get(
              `${API_BASEURL}/models?filter=[{"name":"tissue","op":"eq","val":"${tissueClean}"}]`
            )
            .then(resp => {
              return resp.data.data;
            });
        }
        promise.then(resp => {
          // Set up the ordering options
          const order = [];
          opts.order.forEach(ordItem => {
            order.push(
              `${ordItem.dir === 'asc' ? '' : '-'}${cols[ordItem.column].api}`
            );
          });
          const orderStr = order.join(',');

          // Set up the page options
          const apiOpts = {
            'page[size]': opts.length
          };

          // Set up the page number
          if (opts.start) {
            apiOpts['page[number]'] = opts.start / opts.length + 1;
          }
          setParamsInUrl(
            {
              start: opts.start
            },
            history
          );

          if (orderStr) {
            apiOpts['sort'] = orderStr;
          }

          if (resp && resp.length) {
            // We have a tissue selected
            apiOpts[
              'filter'
            ] = `[{"name":"model_name","op":"in_","val":[${resp
              .map(m => `"${m.attributes.model_name}"`)
              .join(',')}]}]`;
          }

          axios
            .get(`${API_BASEURL}/datasets/crispr`, {
              params: {
                ...apiOpts
              }
            })
            .then(resp => {
              const formatted = formatData(resp.data.data);
              const o = {
                recordsTotal: resp.data.meta.count,
                recordsFiltered: resp.data.meta.count,
                data: formatted,
                draw: opts.draw
              };
              cbak(o);
            });

          console.log('ok');
        });
      }
    });

    this.setState({
      table
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const table = $('.data-table-wrapper')
    //   .find('table')
    //   .DataTable();
    // table.clear();

    // if (this.state.table) {
    // console.log(`${this.props.start} vs ${nextProps.start}`);
    // if (nextProps.start !== this.props.start) {
    //   reloadTableData(this.state.table);
    // }
    // }

    // if (props.names.length !== this.props.names.length) {
    //   reloadTableData(nextProps.names);
    // } else {
    //   updateTable(nextProps.names);
    // }
    return true;
    // return false;
  }

  componentWillUnmount() {
    this.state.table.destroy(true);
  }

  render() {
    const tissuesFilter = <TissuesChips table={this.state.table} />;
    const valuesFilter = <ValuesFilter />;
    const rowStyle = {
      marginBottom: '25px'
    };
    return (
      <div>
        <div className="page-header">
          <h2>Essentiality table</h2>
        </div>
        <Row style={rowStyle}>
          <Col sm={4}>
            <FilterBox header={'Tissues'} body={tissuesFilter} />
          </Col>
          <Col sm={4}>
            <FilterBox header={'Value'} body={valuesFilter} />
          </Col>
        </Row>

        <Card>
          <table className="table dataTable crispr-table" ref="main">
            <thead>
              <tr role="row">
                <th>Gene</th>
                <th>Model</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody />
          </table>
        </Card>
      </div>
    );
  }
}

const setParamsInUrl = (newParams, history) => {
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

const mapStateToProps = state => {
  return {
    start: state.tableStart,
    tissue: state.tableTissue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // changeStart: start => dispatch(tableStartChanged(start)),
    setTissue: tissue => dispatch(tableTissueFilter(tissue))
  };
};

// export default Table;
export default connect(mapStateToProps, mapDispatchToProps)(Table);
