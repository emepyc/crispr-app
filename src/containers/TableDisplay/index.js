import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import ArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp';
import ArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

class SortArrows extends React.Component {
  constructor(props) {
    super(props);
  }

  setSort = (onSortChange, field) => {
    onSortChange(field);
  };

  render() {
    const { onSortChange, field } = this.props;

    const ArrowDownStyle =
      field === this.props.sort && this.props.sortDirection === 1
        ? {
            opacity: 1
          }
        : {
            opacity: 0.3
          };

    const ArrowUpStyle =
      field === this.props.sort && this.props.sortDirection === -1
        ? {
            opacity: 1
          }
        : {
            opacity: 0.3
          };

    return (
      <span onClick={() => this.setSort(onSortChange, field)}>
        <FontAwesomeIcon
          style={{ ...ArrowDownStyle, fontSize: '0.9em' }}
          icon={ArrowDown}
        />
        <FontAwesomeIcon
          style={{ ...ArrowUpStyle, fontSize: '0.9em' }}
          icon={ArrowUp}
        />
      </span>
    );
  }
}

class TableDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.columnKeys = props.columns ? this.getColumnKeys(props.columns) : {};
  }

  getColumnKeys = columns =>
    columns.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true
      };
    }, {});

  mouseOver = rowData => {
    this.props.selectRow(rowData);
  };

  componentWillUnmoun() {}

  render() {
    const { selectedEssentiality, data } = this.props;

    const { loading } = this.props;
    if (loading) {
      return (
        <div
          id="loading"
          style={{
            width: '100%',
            marginTop: '10px',
            marginLeft: '10px',
            float: 'left'
          }}
        >
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            fixedWidth
            style={{ fontSize: '2em' }}
          />
        </div>
      );
    }

    return (
      <Table responsive>
        <thead>
          <tr>
            {this.columnKeys['gene'] && (
              <th>
                Gene <SortArrows {...this.props} field="gene_symbol" />
              </th>
            )}
            {this.columnKeys['model'] && (
              <th>
                Model <SortArrows {...this.props} field="model_name" />
              </th>
            )}
            {this.columnKeys['logFC'] && (
              <th>
                <nobr>
                  LogFC <SortArrows {...this.props} field="fc_corrected" />
                </nobr>
              </th>
            )}
            {this.columnKeys['lossOfFitnessScore'] && (
              <th>
                Loss of fitness score{' '}
                <SortArrows {...this.props} field="bagel_bf_scaled" />
              </th>
            )}
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
                {this.columnKeys['gene'] && (
                  <th scope="row">
                    <Link
                      onClick={() => this.props.selectGene(row[0])}
                      to={`/gene/${row[0]}?model=${row[1]}`}
                    >
                      {row[0]}
                    </Link>
                  </th>
                )}
                {this.columnKeys['model'] && (
                  <td>
                    <Link
                      onClick={() => this.props.selectModel(row[1])}
                      to={`/model/${row[1]}?gene=${row[0]}`}
                    >
                      {row[1]}
                    </Link>
                  </td>
                )}
                {this.columnKeys['logFC'] && <td>{row[2]}</td>}
                {this.columnKeys['lossOfFitnessScore'] && <td>{row[3]}</td>}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default TableDisplay;
