import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../store/store';
import { Row, Col } from 'reactstrap';
import * as d3 from 'd3';

import colors from '../../colors';
import { tableTissueFilter } from '../../modules/actions/table';
import './pieChart.css';

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerWidth: -1
    };
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({
      containerWidth: this.refs['piechart-container'].offsetWidth
    });
  };

  gotoTable = d => {
    this.props.setTissue(d.data.id);
    history.push({
      pathname: '/table',
      search: `?tissue=${d.data.id}`
    });
  };

  setFocus = d => {
    const bbox = d3
      .select(`.${d.data.id}`)
      .node()
      .getBoundingClientRect();
    console.log(
      d3
        .select(`.${d.data.id}`)
        .node()
        .getBoundingClientRect()
    );
    const tooltip = d3
      .select(this.refs['piechart-tooltip'])
      .style('display', 'block')
      .html(`${d.data.tissue}<br /><b>${d.data.counts}</b>`);
    if (d3.event) {
      console.log(`${d3.event.offsetX}, ${d3.event.offsetY}`);
      tooltip
        .style('left', `${d3.event.offsetX}px`)
        .style('top', `${d3.event.offsetY}px`);
    } else {
      // tooltip.style('left', `${bbox.left}px`).style('top', `${bbox.top}px`);
    }
    d3.selectAll('.arc, .tissue-label').style('opacity', '0.1');
    d3.selectAll(`.${d.data.id}`).style('opacity', '1');
  };

  removeFocus = () => {
    d3.selectAll('.arc, .tissue-label').style('opacity', '1');
    const tooltip = d3.select(this.refs['piechart-tooltip']);
    tooltip.style('display', 'none');
  };

  plotPieChart(tissues) {
    const pieChartWidth = this.state.containerWidth;

    // Fast way of removing previous content
    // TODO: Shouldn't this be to resize?
    const element = this.refs['piechart-container'];
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    const g = d3
      .select(element)
      .append('svg')
      .attr('width', pieChartWidth)
      .attr('height', pieChartWidth)
      .append('g')
      .attr('transform', `translate(${pieChartWidth / 2},${pieChartWidth / 2})`)
      .on('mouseout', this.removeFocus);
    const radius = pieChartWidth / 2;

    // const color = d3.scaleOrdinal(schemePaired);
    const pie = d3
      .pie()
      .sortValues((a, b) => b - a)
      .value(d => d.counts);

    const path = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    tissues.forEach(d => {
      d.counts = +d.counts;
    });

    const arc = g
      .selectAll('.arc')
      .data(pie(tissues))
      .enter()
      .append('g')
      .attr('class', d => `arc ${d.data.id}`);

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', d => colors[d.data.tissue])
      .on('mouseover', d => {
        this.setFocus(d);
      })
      .on('click', d => {
        this.gotoTable(d);
      });
  }

  render() {
    const tooltipStyle = {
      position: 'absolute',
      maxWidth: '150px',
      minWidth: '100px',
      backgroundColor: 'white',
      border: '1px solid grey',
      borderRadius: '5px',
      display: 'none',
      pointerEvents: 'none'
    };

    const tissuesContainerBody = (
      <Row>
        <Col className="my-auto" xs="6">
          <div ref="piechart-container" style={{ position: 'relative' }} />
          <div
            ref="piechart-tooltip"
            className={'text-center'}
            style={tooltipStyle}
          />
        </Col>
        <Col
          style={{ borderRight: '1px solid green', padding: '20px' }}
          xs="6"
          className="d-none d-lg-block my-auto"
        >
          <ul>
            {this.props.tissues
              .sort((a, b) => b.counts - a.counts)
              .map((tissue, index) => (
                <li key={tissue.tissue}>
                  <span
                    style={{ color: tissue.color }}
                    className={`tissue-label text-left ${tissue.id}`}
                    onClick={() => this.gotoTable({ data: { id: tissue.id } })}
                    onMouseOver={ev => {
                      console.log(this);
                      this.setFocus({
                        data: {
                          tissue: tissue.tissue,
                          counts: tissue.counts,
                          id: tissue.id
                        }
                      });
                    }}
                    onMouseOut={this.removeFocus}
                  >
                    {tissue.tissue}:{tissue.counts}
                  </span>
                </li>
              ))}
          </ul>
        </Col>
      </Row>
    );

    const element = <div>{tissuesContainerBody}</div>;

    if (this.props.tissues && this.props.tissues.length) {
      this.plotPieChart(this.props.tissues);
    }

    return element;
  }
}

const mapStateToProps = state => {
  return {
    tissues: state.tissues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTissue: tissue => dispatch(tableTissueFilter(tissue))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
