import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

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
          style={{ width: '100%', marginTop: '10px', float: 'left' }}
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
            {this.columnKeys['gene'] && <th>Gene</th>}
            {this.columnKeys['model'] && <th>Model</th>}
            {this.columnKeys['logFC'] && <th>LogFC</th>}
            {this.columnKeys['lossOfFitnessScore'] && (
              <th>Loss of fitness score</th>
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
