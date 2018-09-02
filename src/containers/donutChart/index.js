// import Event from "@vx/event";
import * as d3 from 'd3';
import { Group } from '@vx/group';
import { Pie, Line } from '@vx/shape';
import { Point } from '@vx/point';
import { withTooltip, TooltipWithBounds } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import React from 'react';
import { tableTissueFilter } from '../../modules/actions/table';
import { connect } from 'react-redux';
import colors from '../../colors';
import { history } from '../../store/store';
import './donutChart.css';

function Label({ radius, arc, x, y, maxX, center, children }) {
  const midAngle = (arc.endAngle + arc.startAngle) / 2;
  const xDiagonal = (radius + 20) * Math.cos(midAngle - Math.PI / 2);
  const yDiagonal = (radius + 20) * Math.sin(midAngle - Math.PI / 2);
  const xHorizontal = xDiagonal < 0 ? xDiagonal - 10 : xDiagonal + 10;

  if (arc.endAngle - arc.startAngle < 0.1) {
    return <span />;
  }

  return (
    <React.Fragment>
      <Line
        stroke={colors[arc.data.tissue]}
        from={new Point({ x: x, y: y })}
        to={new Point({ x: xDiagonal, y: yDiagonal })}
      />
      <Line
        stroke={colors[arc.data.tissue]}
        from={new Point({ x: xDiagonal, y: yDiagonal })}
        to={new Point({ x: xHorizontal, y: yDiagonal })}
      />
      <text
        fill={d3.rgb(colors[arc.data.tissue]).darker()}
        x={xHorizontal < 0 ? xHorizontal - 3 : xHorizontal + 3}
        y={yDiagonal}
        fontSize="0.7em"
        alignmentBaseline="middle"
        textAnchor={xDiagonal < 0 ? 'end' : 'start'}
      >
        {children}
      </text>
    </React.Fragment>
  );
}

class DonutChart extends React.Component {
  constructor(props) {
    super(props);

    this.containerElement = React.createRef();
    this.state = {
      containerWidth: 0
    };
  }

  componentDidMount() {
    // this.resize();
    // window.addEventListener('resize', this.resize);
    // window.addEventListener('resize', () => {
    //   this.setState({
    //     containerWidth: 100, // TODO: fix by not fixing
    //   })
    // });
    this.setState({
      containerWidth: this.containerElement.current.offsetWidth
    });
  }

  // resize = () => {
  //   console.log(this.refs['donut-container']);
  //   this.setState({
  //     containerWidth: this.refs['donut-container'].offsetWidth
  //   });
  // };

  calculateSideOffset = tissues => {
    return d3.max(tissues, tissue => tissue.tissue.length) * 1.6;
  };

  gotoTable = d => {
    this.props.setTissue(d.data.id);
    history.push({
      pathname: '/table',
      search: `?tissue=${d.data.id}`
    });
  };

  _handleMouseOverBar = (event, tissue) => {
    // info in the center of the donut chart
    const explanationElement = this.refs['explanation-message'];
    explanationElement.innerHTML = `${tissue.data.tissue}<br /><strong>${
      tissue.data.counts
    }</strong> cell lines`;

    // style of slices
    const slices = d3.select(this.containerElement.current).selectAll('path');
    slices.each(function() {
      this.parentNode.classList.add('faded');
    });
    event.target.parentNode.classList.remove('faded');
  };

  _handleMouseOutBar = () => {
    const { hideTooltip } = this.props;
    d3
      .select(this.containerElement.current)
      .selectAll('path')
      .each(function() {
        this.parentNode.classList.remove('faded');
      });
    hideTooltip();
  };

  _handleMouseMoveBar = (event, tissue) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    this.props.showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: (
        <div>
          {tissue.data.tissue}: <strong>{tissue.data.counts}</strong>
        </div>
      )
    });
  };

  render() {
    const { tissues } = this.props;
    const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen } = this.props;

    const pieChartWidth = this.state.containerWidth;

    const donutChartSideOffset = this.calculateSideOffset(tissues) * 3;

    const margin = {
      top: 70,
      left: donutChartSideOffset || 0,
      right: donutChartSideOffset || 0,
      bottom: 0
    };

    const radius = (pieChartWidth - (margin.left + margin.right)) / 2;

    return (
      <div style={{ position: 'relative' }} ref={this.containerElement}>
        <div
          id="explanation"
          className="my-auto"
          style={{
            top: `${radius + radius * 0.5}px`,
            left: `${radius + donutChartSideOffset - radius * 1.5 / 2}px`,
            borderRadius: `${radius * 1.5 / 2}`,
            width: `${radius * 1.5}px`
          }}
        >
          <span ref="explanation-message" className="reset" />
        </div>
        <svg className="donutChart" width={pieChartWidth} height={300}>
          <Group top={radius + margin.top} left={radius + margin.left}>
            <Pie
              data={tissues}
              pieValue={d => d.counts}
              outerRadius={radius}
              innerRadius={radius - 20}
              fill={d => colors[d.data.tissue]}
              cornerRadius={0}
              padAngle={0}
              centroid={(centroid, arc) => {
                const [x, y] = centroid;
                return (
                  <Label
                    radius={radius}
                    arc={arc}
                    x={x}
                    y={y}
                    maxX={pieChartWidth}
                    center={radius + margin.left}
                  >
                    {arc.data.tissue}
                  </Label>
                );
              }}
              onClick={d => () => {
                this.gotoTable(d);
              }}
              onMouseOver={d => event => {
                this._handleMouseOverBar(event, d);
              }}
              onMouseMove={d => event => {
                this._handleMouseMoveBar(event, d);
              }}
              onMouseOut={() => this._handleMouseOutBar}
            />
          </Group>
        </svg>
        {tooltipOpen && (
          <TooltipWithBounds
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            {tooltipData}
          </TooltipWithBounds>
        )}
      </div>
    );
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

export default withTooltip(
  connect(mapStateToProps, mapDispatchToProps)(DonutChart)
);
