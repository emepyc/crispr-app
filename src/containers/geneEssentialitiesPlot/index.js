import React from 'react';
import * as d3 from 'd3';
import PlotCss from './geneEssentialitiesPlot.css';

class geneEssentialitiesPlot extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   containerWidth: -1
    // };
  }

  // componentDidMount() {
  //
  // }

  plotEssentialities(data) {
    const elementSvg = this.refs['essentialities-plot-svg'];
    const elementCanvas = this.refs['essentialities-plot-canvas'];

    // Fast way to remove prev content
    // if (elementCanvas) {
    //   while (elementCanvas.firstChild) {
    //     elementCanvas.removeChild(elementCanvas.firstChild);
    //   }
    // }

    const marginLeft = 50;
    const marginTop = 50;
    const width = 500;
    const height = 500;
    const svg = d3.select(elementSvg);
    const pane = svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => {
        console.log('mouseover!!');
      });

    const canvas = d3.select(elementCanvas);

    const ctx = canvas.node().getContext('2d');
    const insignifNodeColor = 'grey';
    const signifNodeColor = 'red';
    const nodeRadius = 3;
    const attribute = 'fc';
    data = data.sort(
      (a, b) => a.attributes[attribute] - b.attributes[attribute]
    );

    const yExtent = d3.extent(data, d => d.attributes[attribute]);
    const yScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([yExtent[0] - 1, yExtent[1] + 1]);

    const xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([-3, data.length + 30]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${height - marginTop})`)
      .call(xAxis);
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${-marginTop})`)
      .call(yAxis);

    // x scale title
    svg
      .append('text')
      .attr('x', xScale(data.length / 2))
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text('Cell lines');

    // y scale title
    svg
      .append('text')
      .attr('transform', `translate(15, ${width / 2}) rotate(-90)`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .text('Fold change');

    // Nodes display
    ctx.save();
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      ctx.beginPath();
      ctx.arc(
        xScale(i),
        yScale(d.attributes[attribute]),
        nodeRadius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = 'gray';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
    }
  }

  render() {
    const width = 500;
    const height = 500;
    const template = (
      <div className="essentialities-plot-container">
        <canvas
          ref="essentialities-plot-canvas"
          className="star-plot-toplevel-container leave-space"
          height={height}
          width={width}
        />
        <svg
          ref="essentialities-plot-svg"
          className="star-plot-toplevel-container top"
          height={height}
          width={width}
        />
      </div>
    );

    if (this.props.data.data && this.props.data.data.length) {
      this.plotEssentialities(this.props.data.data);
    }

    return template;
  }
}

export default geneEssentialitiesPlot;
