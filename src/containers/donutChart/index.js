// import Event from "@vx/event";
import * as d3 from 'd3';
import { Group } from '@vx/group';
import { Pie, Line } from '@vx/shape';
import { Point } from '@vx/point';
// import Tooltip from "@vx/tooltip";
import React from 'react';
import { tableTissueFilter } from '../../modules/actions/table';
import { connect } from 'react-redux';
import colors from '../../colors';
import { history } from '../../store/store';

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
      containerWidth: -1
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

  render() {
    const { tissues } = this.props;
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
        <svg width={pieChartWidth} height={300}>
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
              onClick={d => event => {
                this.gotoTable(d);
              }}
              onMouseOver={d => event => {
                console.log('mouseover!');
                console.log(d);
              }}
            />
          </Group>
        </svg>
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

export default connect(mapStateToProps, mapDispatchToProps)(DonutChart);
