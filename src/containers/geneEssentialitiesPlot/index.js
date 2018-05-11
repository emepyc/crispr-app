import React from 'react';
import * as d3 from 'd3';
import sortBy from 'lodash.sortby';
import './geneEssentialitiesPlot.css';

class geneEssentialitiesPlot extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   containerWidth: -1
    // };
    this.width = 500;
    this.height = 500;
    this.marginTop = 50;
    this.marginLeft = 50;
    this.brushHeight = 50;
  }

  componentDidMount() {
    if (this.props.data.data && this.props.data.data.length) {
      this.plotEssentialities(this.props.data.data);
    }
  }

  showTooltip(x, y, el, msg) {
    el
      .text(msg)
      .style('left', `${x}px`)
      .style('top', `${y}px`)
      .style('display', 'block');
  }

  hideTooltip(el) {
    el.style('display', 'none');
  }

  plotEssentialities(data) {
    const { marginTop, marginLeft, width, height, brushHeight } = this;
    const elementSvg = this.refs['essentialities-plot-svg'];
    const elementCanvas = this.refs['essentialities-plot-canvas'];
    const elementTooltip = this.refs['essentialities-plot-tooltip'];
    const elementBrush = this.refs['essentialities-plot-brush'];

    // Fast way to remove prev content
    // if (elementCanvas) {
    //   while (elementCanvas.firstChild) {
    //     elementCanvas.removeChild(elementCanvas.firstChild);
    //   }
    // }`

    //create brush function redraw scatterplot with selection
    function brushed() {
      const selection = d3.event.selection;
      xScale.domain(selection.map(xScaleBrush.invert, xScaleBrush));
      plotOnCanvas();
    }

    function plotOnCanvas() {
      // Nodes display
      ctx.clearRect(0, 0, width - marginLeft, height - marginTop);
      ctx.save();
      for (let i = 0; i < dataWithI.length; i++) {
        const d = dataWithI[i];
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
    }

    const attribute = 'fc_corrected';

    const dataSorted = sortBy(data, rec => rec.attributes[attribute]);

    const dataWithI = dataSorted.map((d, i) => {
      return { ...d, index: i };
    });

    const tooltip = d3.select(elementTooltip);
    const quadTree = d3.quadtree(
      dataWithI,
      d => d.index,
      d => d.attributes[attribute]
    );
    const svg = d3.select(elementSvg);
    svg
      .append('rect')
      .attr('x', marginLeft)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height - marginTop)
      .on('mousemove', () => {
        const ev = d3.event;

        // map the clicked point to the data space
        const xClicked = xScale.invert(ev.offsetX - marginLeft);
        const yClicked = yScale.invert(ev.offsetY);

        // find the closest point in the dataset to the clicked point
        const closest = quadTree.find(xClicked, yClicked);
        const closestX = closest.index;
        const closestY = closest.attributes[attribute];
        this.showTooltip(
          xScale(closestX),
          yScale(closestY),
          tooltip,
          `${closest.attributes.model_name}`
        );
      })
      .on('mouseout', () => {
        this.hideTooltip(tooltip);
      });

    const canvas = d3.select(elementCanvas);
    const ctx = canvas.node().getContext('2d');
    const insignifNodeColor = '#758E4F';
    const signifNodeColor = '#FFCC00';
    const nodeRadius = 3;

    const yExtent = d3.extent(dataWithI, d => d.attributes[attribute]);
    const yScale = d3
      .scaleLinear()
      .range([0, height - marginTop])
      .domain([yExtent[1], yExtent[0]]);

    const xScale = d3
      .scaleLinear()
      .range([0, width - marginLeft])
      .domain([0, dataWithI.length]);

    const xScaleBrush = d3
      .scaleLinear()
      .range([0, width - marginLeft])
      .domain([0, dataWithI.length]);

    const brush = d3
      .brushX()
      .extent([[0, 0], [width - marginLeft, 50]])
      .on('brush', brushed);

    d3
      .select(elementBrush)
      .append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, xScale.range());

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${height - marginTop})`)
      .call(xAxis);
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(yAxis);

    // x scale title
    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height})`)
      .attr('text-anchor', 'middle')
      .text('Cell lines');

    // y scale title
    svg
      .append('text')
      .attr('transform', `translate(15, ${height / 2}) rotate(-90)`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .text('Fold change');

    plotOnCanvas();
  }

  render() {
    const { marginTop, marginLeft, width, height } = this;
    return (
      <React.Fragment>
        <svg
          ref="essentialities-plot-brush"
          className="leave-space"
          height="50"
          width={width - marginLeft}
        />
        <div className="essentialities-plot-container">
          <canvas
            ref="essentialities-plot-canvas"
            className="star-plot-toplevel-container leave-space"
            height={height - marginTop}
            width={width - marginLeft}
          />
          <svg
            ref="essentialities-plot-svg"
            className="star-plot-toplevel-container top"
            height={height}
            width={width}
          />
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
      </React.Fragment>
    );
  }
}

export default geneEssentialitiesPlot;
