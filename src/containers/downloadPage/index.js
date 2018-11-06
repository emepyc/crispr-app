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
                  sgRNA Read Count
                  <sup>
                    <a href="#" id="RawDataFilesTooltip">
                      ?
                    </a>
                  </sup>
                </th>
                <th>
                  Copy Number Bias Corrected Log Fold Change Values
                  <sup>
                    <a href="#" id="CorrectedDataFilesTooltip">
                      ?
                    </a>
                  </sup>
                </th>
                <th>
                  Fitness/Non-fitness Binary Matrix
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
            Unprocessed sgRNA read count files; each file includes plasmid read
            counts.
          </Tooltip>
          <Tooltip
            placement="right"
            isOpen={this.state.CorrectedTooltipOpen}
            target="CorrectedDataFilesTooltip"
            toggle={() => this.toggle('CorrectedTooltipOpen')}
          >
            Gene level log fold changes; gene independent bias corrected using
            CRISPRcleanR default settings.
          </Tooltip>
          <Tooltip
            placement="right"
            isOpen={this.state.ScaledTooltipOpen}
            target="ScaledDataFilesTooltip"
            toggle={() => this.toggle('ScaledTooltipOpen')}
          >
            Binary matrix defining each gene in each cell line as a fitness gene
            or not based on bayes factors values calculated using BAGEL and
            scaled with respect to a 5% false discovery rate threshold.
          </Tooltip>
        </div>
      </div>
    );
  }
}
