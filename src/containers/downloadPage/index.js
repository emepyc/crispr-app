import React from 'react';
import { Table, Tooltip } from 'reactstrap';

export default class Downloads extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      RawTooltipOpen: false,
      CorrectedTooltipOpen: false,
      ScaledTooltipOpen: false
    };
  }

  toggle(tooltipId) {
    this.setState({
      [tooltipId]: !this.state[tooltipId]
    });
  }

  render() {
    return (
      <div
        style={{
          marginTop: '20px',
          marginLeft: '40px',
          marginRight: '40px',
          minHeight: '30rem'
        }}
      >
        <div
          className="section"
          style={{ borderBottom: '1px solid green', paddingBottom: '20px' }}
        >
          <h2>Downloads</h2>
        </div>
        <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
          <Table responsive>
            <thead>
              <tr>
                <th>Data release</th>
                <th>
                  Raw data files{' '}
                  <sup>
                    <a href="#" id="RawDataFilesTooltip">
                      ?
                    </a>
                  </sup>
                </th>
                <th>
                  Corrected data files{' '}
                  <sup>
                    <a href="#" id="CorrectedDataFilesTooltip">
                      ?
                    </a>
                  </sup>
                </th>
                <th>
                  Scaled Bayes Factor/binary matrix of essentiality{' '}
                  <sup>
                    <a href="#" id="ScaledDataFilesTooltip">
                      ?
                    </a>
                  </sup>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Release 1 (19th July 2018)</td>
                <td>Coming soon</td>
                <td>Coming soon</td>
                <td>Coming soon</td>
              </tr>
            </tbody>
          </Table>
          <Tooltip
            placement="right"
            isOpen={this.state.RawTooltipOpen}
            target="RawDataFilesTooltip"
            toggle={() => this.toggle('RawTooltipOpen')}
          >
            Description of raw data files
          </Tooltip>
          <Tooltip
            placement="right"
            isOpen={this.state.CorrectedTooltipOpen}
            target="CorrectedDataFilesTooltip"
            toggle={() => this.toggle('CorrectedTooltipOpen')}
          >
            Description of corrected data files
          </Tooltip>
          <Tooltip
            placement="right"
            isOpen={this.state.ScaledTooltipOpen}
            target="ScaledDataFilesTooltip"
            toggle={() => this.toggle('ScaledTooltipOpen')}
          >
            Description of scaled data files
          </Tooltip>
        </div>
      </div>
    );
  }
}
