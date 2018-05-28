import React from 'react';
import * as d3 from 'd3';
import sortBy from 'lodash.sortby';
import find from 'lodash.find';
import { connect } from 'react-redux';
import { selectRow } from '../customTable/actions/customTable';

import './geneEssentialitiesPlot.css';

class geneEssentialitiesPlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerWidth: 100
    };

    // this.width = 500;
    this.height = 500;
    this.marginTop = 50;
    this.marginLeft = 50;
    this.brushHeight = 50;

    this.insignifNodeColor = '#758E4F';
    this.signifNodeColor = '#FFCC00';
    this.nodeRadius = 3;

    this.ctx = null;
    this.xScale = null;
    this.yScale = null;
    this.xAxis = null;
    this.axisBottom = null;

    this.data = [];
    this.attribute = 'fc_corrected';
  }

  // Remove previous elements (axis, etc)
  cleanPlot = () => {};

  resize = () => {
    const container = this.refs['plot-container'];

    this.setState(
      {
        containerWidth: container.offsetWidth
      },
      () => {
        if (this.props.data.length) {
          this.cleanPlot();
          this.plotEssentialities(this.props.data);
        }
      }
    );
  };

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data && prevProps.data !== this.props.data) {
      this.resize();
    }

    if (
      this.props.selectedEssentiality &&
      prevProps.selectedEssentiality !== this.props.selectedEssentiality
    ) {
      const selectedNode = this.rowToNode(this.props.selectedEssentiality);
      if (selectedNode) {
        // console.log('selected node from component did update is...');
        // console.log(selectedNode);
        this.highlightNode(selectedNode);
      }
    }
  }

  showTooltip = (x, y, el, msg) => {
    el
      .text(msg)
      .style('left', `${x}px`)
      .style('top', `${y}px`)
      .style('display', 'block');
  };

  hideTooltip = el => {
    el.style('display', 'none');
  };

  // TODO: Needs a more performant way of finding X
  rowToNode = row => {
    return find(this.data, d => d.attributes.model_name === row[1]);
  };

  plotOnCanvas = () => {
    const {
      ctx,
      marginLeft,
      height,
      marginTop,
      xAxis,
      xScale,
      yScale,
      data,
      signifNodeColor,
      insignifNodeColor,
      nodeRadius,
      attribute
      // axisBottom
    } = this;
    const { containerWidth } = this.state;
    const { selectedEssentiality } = this.props;

    // Nodes display
    ctx.clearRect(0, 0, containerWidth - marginLeft, height - marginTop);
    ctx.save();
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      ctx.beginPath();
      ctx.arc(
        xScale(d.index),
        yScale(d.attributes[attribute]),
        nodeRadius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle =
        d.attributes[attribute] < 0.05 ? signifNodeColor : insignifNodeColor;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle =
        d.attributes[attribute] < 0.05 ? signifNodeColor : insignifNodeColor;
      ctx.stroke();
    }

    if (xAxis) {
      const axisBottom = d3
        .select(this.refs['essentialities-plot-axis-bottom'])
        .attr('transform', `translate(${marginLeft},${height - marginTop})`);
      axisBottom.call(this.xAxis);
    }

    // selected node
    if (selectedEssentiality) {
      const nodeToHighlight = this.rowToNode(selectedEssentiality);
      if (nodeToHighlight) {
        this.highlightNode(nodeToHighlight);
      }
    }
  };

  highlightNode = node => {
    const { marginLeft } = this;
    const closestX = node.index;
    const closestY = node.attributes[this.attribute];

    const elementTooltip = this.refs['essentialities-plot-tooltip'];
    const guideX = this.refs['essentialities-plot-xline'];
    const guideY = this.refs['essentialities-plot-yline'];
    const tooltip = d3.select(elementTooltip);

    // Show the guide
    const guideXpos = this.xScale(closestX) + marginLeft;
    const guideYpos = this.yScale(closestY);
    guideX.setAttribute('x1', guideXpos);
    guideX.setAttribute('x2', guideXpos);
    guideX.style.display = 'block';
    guideY.setAttribute('y1', guideYpos);
    guideY.setAttribute('y2', guideYpos);
    guideY.style.display = 'block';

    this.showTooltip(
      this.xScale(closestX) + marginLeft,
      this.yScale(closestY),
      tooltip,
      `${node.attributes.model_name}` // TODO: parameterise
    );
  };

  plotEssentialities(data) {
    console.log('in plot essentialities data is...');
    console.log(data);
    const { marginTop, marginLeft, height, brushHeight } = this;
    const { containerWidth } = this.state;
    const elementSvg = this.refs['essentialities-plot-svg'];
    const elementCanvas = this.refs['essentialities-plot-canvas'];
    const elementTooltip = this.refs['essentialities-plot-tooltip'];
    const elementBrush = this.refs['essentialities-plot-brush'];
    const guideX = this.refs['essentialities-plot-xline'];
    const guideY = this.refs['essentialities-plot-yline'];
    // const axisBottom = this.refs['essentialities-plot-axis-bottom'];
    const axisLeft = this.refs['essentialities-plot-axis-left'];
    const xAxisLabel = this.refs['x-axis-label'];
    const yAxisLabel = this.refs['y-axis-label'];

    const dataSorted = sortBy(data, rec => rec.attributes[this.attribute]);

    this.data = dataSorted.map((d, i) => {
      return { ...d, index: i };
    });

    const tooltip = d3.select(elementTooltip);
    const quadTree = d3.quadtree(
      this.data,
      d => d.index,
      d => d.attributes[this.attribute]
    );
    const svg = d3.select(elementSvg);

    svg
      .append('rect')
      .attr('x', marginLeft)
      .attr('y', 0)
      .attr('width', containerWidth - marginLeft)
      .attr('height', height - marginTop)
      .on('mousemove', () => {
        const ev = d3.event;

        // map the clicked point to the data space
        const xClicked = this.xScale.invert(ev.offsetX - marginLeft);
        const yClicked = this.yScale.invert(ev.offsetY);

        // find the closest point in the dataset to the clicked point
        const closest = quadTree.find(xClicked, yClicked);
        this.highlightNode(closest);
        this.props.selectRow([
          closest.attributes.gene_symbol,
          closest.attributes.model_name,
          closest.attributes[this.attribute]
        ]);
      })
      .on('mouseout', () => {
        this.hideTooltip(tooltip);
        guideX.style.display = 'none';
        guideY.style.display = 'none';
      });

    const brushLine = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(d => xScaleBrush(d.index))
      .y0(brushHeight)
      .y1(d => yScaleBrush(d.attributes[this.attribute]));

    //create brush function redraw scatterplot with selection
    const brushed = () => {
      const selection = d3.event.selection;
      this.xScale.domain(selection.map(xScaleBrush.invert, xScaleBrush));
      this.plotOnCanvas();
    };

    const canvas = d3.select(elementCanvas);
    this.ctx = canvas.node().getContext('2d');

    const yExtent = d3.extent(this.data, d => d.attributes[this.attribute]);
    this.xScale = d3
      .scaleLinear()
      .range([0, containerWidth - marginLeft])
      .domain([0, this.data.length]);

    this.yScale = d3
      .scaleLinear()
      .range([0, height - marginTop])
      .domain([yExtent[1], yExtent[0]]);

    const xScaleBrush = d3
      .scaleLinear()
      .range([0, containerWidth - marginLeft])
      .domain([0, this.data.length]);

    const yScaleBrush = d3
      .scaleLinear()
      .range([0, brushHeight])
      .domain([yExtent[1], yExtent[0]]);

    const brush = d3
      .brushX()
      .extent([[0, 0], [containerWidth - marginLeft, brushHeight]])
      .on('brush', brushed);

    const brushSelection = d3.select(elementBrush);

    brushSelection
      .append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', brushLine);

    brushSelection
      .append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, this.xScale.range());

    this.xAxis = d3.axisBottom(this.xScale).tickFormat(d3.format('.0f'));
    this.yAxis = d3.axisLeft(this.yScale);

    // const axisBottom = d3.select(this.refs['essentialities-plot-axis-bottom'])
    //     .attr('transform', `translate(${marginLeft},${height - marginTop})`);
    // axisBottom.call(this.xAxis);

    // this.axisBottom = svg
    //     .append('g')
    //     .attr('id', 'axisBottom')
    //     .attr('transform', `translate(${marginLeft},${height - marginTop})`);

    // svg
    //     .append('g')
    //     .attr('transform', `translate(${marginLeft},0)`)
    //     .call(this.yAxis);

    // x scale title
    // svg
    //     .append('text')
    //     .attr('transform', `translate(${containerWidth / 2}, ${height - 10})`)
    //     .attr('text-anchor', 'middle')
    //     .text('Cell lines');

    d3.select(axisLeft).call(this.yAxis);

    d3
      .select(xAxisLabel)
      .attr('transform', `translate(${containerWidth / 2}, ${height - 10})`);

    d3
      .select(yAxisLabel)
      .attr('transform', `translate(15, ${height / 2}) rotate(-90)`);

    // y scale title
    // svg
    //     .append('text')
    //     .attr('transform', `translate(15, ${height / 2}) rotate(-90)`)
    //     .attr('x', 0)
    //     .attr('y', 0)
    //     .attr('text-anchor', 'middle')
    //     .text('Fold change');

    this.plotOnCanvas();
  }

  render() {
    const { marginTop, marginLeft, height, brushHeight } = this;
    const { containerWidth } = this.state;

    return (
      <div ref="plot-container">
        <svg
          ref="essentialities-plot-brush"
          className="leave-space"
          height={brushHeight}
          width={containerWidth - marginLeft}
        />
        <div className="essentialities-plot-container">
          <canvas
            ref="essentialities-plot-canvas"
            className="star-plot-toplevel-container leave-space"
            height={height - marginTop}
            width={containerWidth - marginLeft}
          />
          <svg
            ref="essentialities-plot-svg"
            className="star-plot-toplevel-container top"
            height={height}
            width={containerWidth}
          >
            <line
              ref="essentialities-plot-xline"
              x1="0"
              x2="0"
              y1="0"
              y2={height - marginTop}
              style={{ display: 'none', stroke: '#eeeeee', strokeWidth: '2px' }}
            />
            <line
              ref="essentialities-plot-yline"
              x1={marginLeft}
              x2={containerWidth}
              y1="0"
              y2="0"
              style={{ display: 'none', stroke: '#eeeeee', strokeWidth: '2px' }}
            />
            <g ref="essentialities-plot-axis-bottom" />

            <g
              ref="essentialities-plot-axis-left"
              transform={`translate(${marginLeft},0)`}
            />

            <text ref="x-axis-label" x="0" y="0" textAnchor="middle">
              Cell lines
            </text>

            <text ref="y-axis-label" x="0" y="0" textAnchor="middle">
              Fold change
            </text>
          </svg>
          <div
            ref="essentialities-plot-tooltip"
            className="essentialities-tooltip"
            style={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              backgroundColor: 'white',
              padding: '0.3rem 0.5rem',
              borderRadius: '3px',
              boxShadow: 'gray 0px 1px 2px',
              display: 'none'
            }}
          />
        </div>
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
    selectRow: rowData => dispatch(selectRow(rowData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  geneEssentialitiesPlot
);

// export default geneEssentialitiesPlot;
