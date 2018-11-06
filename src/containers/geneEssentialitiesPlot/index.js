import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import * as d3 from 'd3';
import debounce from 'lodash.debounce';
import find from 'lodash.find';
import findIndex from 'lodash.findindex';
import sortBy from 'lodash.sortby';
import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import tntUtils from 'tnt.utils';
import colors from '../../colors';
import { selectRow } from '../../modules/actions/customTable';
import './geneEssentialitiesPlot.css';

const LOSS_OF_FITNESS_SCORE_LABEL = 'Loss of fitness score';
const FC_CORRECTED_LABEL = 'Corrected log fold change';

const significantField = 'bagel_bf_scaled';

class geneEssentialitiesPlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodeHighlighted: null,
      containerWidth: 100,
      attributeToPlot: 'fc_corrected'
    };

    this.plotEssentialitiesDebounced = debounce(this.plotEssentialities, 300);

    this.height = 300;
    this.marginTop = 50;
    this.marginLeft = 50;
    this.brushHeight = 40;
    this.brushOffset = 10;

    this.insignifNodeColor = '#FFCC00';
    this.signifNodeColor = '#758E4F';
    this.nodeRadius = 3;

    this.ctx = null;
    this.xScale = null;
    this.yScale = null;
    this.xAxis = null;

    this.data = [];
  }

  resize = () => {
    const container = this.refs['plot-container'];
    if (!container) {
      return;
    }

    this.setState(
      {
        containerWidth: container.offsetWidth
      },
      () => {
        if (this.props.data.length) {
          if (this.props.data.length > 2000) {
            this.plotEssentialitiesDebounced(this.props.data);
          } else {
            this.plotEssentialities(this.props.data);
          }
        }
      }
    );
  };

  componentDidMount() {
    // this.resize();
    window.addEventListener('resize', this.resize);
  }

  getScoresForNode(gene, model, nodes) {
    if (!gene || !model || !nodes.length) {
      return null;
    }
    const foundIndex = findIndex(
      nodes,
      node =>
        node.attributes.gene_symbol === gene &&
        node.attributes.model_name === model
    );
    const found = nodes[foundIndex];
    if (!found) {
      return null;
    }
    return [
      found.attributes.fc_corrected,
      found.attributes.bagel_bf_scaled,
      foundIndex
    ];
  }

  componentDidUpdate(prevProps) {
    if (this.props.data && prevProps.data !== this.props.data) {
      this.resize();
    }

    if (
      this.props.selectedEssentiality &&
      prevProps.selectedEssentiality !== this.props.selectedEssentiality
    ) {
      this.highlightNode(this.props.selectedEssentiality);
    }
  }

  componentWillUnmount() {
    this.mouseOutOnCanvas();
    window.removeEventListener('resize', this.resize);
  }

  onSelectAttributeToPlot = selected => {
    this.setState(
      {
        attributeToPlot: selected
      },
      () => this.plotEssentialities(this.props.data)
    );
  };

  showTooltip = (x, y, el, msg) => {
    el
      .html(msg)
      .style('left', `${x}px`)
      .style('top', `${y}px`)
      .style('display', 'block')
      .style('background', 'white');
  };

  hideTooltip = el => {
    el.style('display', 'none');
  };

  rowToNode = row => {
    const node = find(
      this.data,
      d =>
        d.attributes.model_name === row[1] &&
        d.attributes.gene_symbol === row[0]
    );
    return node ? node.index : null;
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
      nodeRadius
    } = this;
    const attribute = this.state.attributeToPlot;
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
        d.attributes[significantField] < 0
          ? signifNodeColor
          : insignifNodeColor;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle =
        d.attributes[significantField] <= 0
          ? signifNodeColor
          : insignifNodeColor;
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
      this.highlightNode(selectedEssentiality);
    }

    if (!this.state.nodeHighlighted) {
      this.highlightDefaultNode();
    }
  };

  highlightNode = node => {
    if (!node) {
      return;
    }
    const index = node[5] !== undefined ? node[5] : this.rowToNode(node);
    const nodeWithIndex = [node[0], node[1], node[2], node[3], index];
    const { marginLeft } = this;
    const [
      gene,
      model,
      log_fold_change,
      fitness_score,
      genePos
    ] = nodeWithIndex;
    const essentiality =
      this.state.attributeToPlot === 'fc_corrected'
        ? log_fold_change
        : fitness_score;
    const elementTooltip = this.refs['essentialities-plot-tooltip'];
    const guideX = this.refs['essentialities-plot-xline'];
    const guideY = this.refs['essentialities-plot-yline'];
    const tooltip = d3.select(elementTooltip);

    // Show the guide
    if (this.xScale && this.yScale) {
      const guideXpos = this.xScale(genePos) + marginLeft;
      const guideYpos = this.yScale(essentiality);
      guideX.setAttribute('x1', guideXpos);
      guideX.setAttribute('x2', guideXpos);
      guideX.style.display = 'block';
      guideY.setAttribute('y1', guideYpos);
      guideY.setAttribute('y2', guideYpos);
      guideY.style.display = 'block';

      this.showTooltip(
        this.xScale(genePos) + marginLeft,
        this.yScale(essentiality),
        tooltip,
        `Gene: <b>${gene}</b><br/>Model: <b>${model}</b><br/>Corrected log fold change:<b>${log_fold_change}</b><br/>Loss of fitness score:<b>${fitness_score}</b>`
      );
      this.setState({
        nodeHighlighted: [gene, model]
      });
    }
  };

  mouseOutOnCanvas = () => {
    const guideX = this.refs['essentialities-plot-xline'];
    const guideY = this.refs['essentialities-plot-yline'];
    const elementTooltip = this.refs['essentialities-plot-tooltip'];

    this.hideTooltip(d3.select(elementTooltip));

    if (!guideX || !guideY) {
      return;
    }

    guideX.style.display = 'none';
    guideY.style.display = 'none';
  };

  mouseMoveOnCanvas = () => {
    const ev = d3.event;

    // map the clicked point to the data space
    const xClicked = this.xScale.invert(ev.offsetX - this.marginLeft);
    const yClicked = this.yScale.invert(ev.offsetY);

    // find the closest point in the dataset to the clicked point
    const closest = this.quadTree.find(xClicked, yClicked);
    const nodeData = [
      closest.attributes.gene_symbol,
      closest.attributes.model_name,
      closest.attributes.fc_corrected,
      closest.attributes.bagel_bf_scaled,
      closest.index
    ];
    this.highlightNode(nodeData);
    this.props.selectRow(nodeData);
  };

  plotEssentialities(data) {
    const { marginTop, marginLeft, height, brushHeight, brushOffset } = this;
    const { containerWidth, attributeToPlot } = this.state;
    const elementCanvas = this.refs['essentialities-plot-canvas'];
    const axisLeft = this.refs['essentialities-plot-axis-left'];
    const eventsContainer = this.refs['essentialities-plot-events-container'];
    const brushLineElement = this.refs['essentialities-plot-brush-line'];
    const brushContainer = this.refs['essentialities-plot-brush-container'];

    const dataSorted = sortBy(data, rec => rec.attributes[attributeToPlot]);

    this.data = dataSorted.map((d, i) => {
      return { ...d, index: i };
    });

    this.quadTree = d3.quadtree(
      this.data,
      d => d.index,
      d => d.attributes[this.state.attributeToPlot]
    );

    d3
      .select(eventsContainer)
      .on('mousemove', this.mouseMoveOnCanvas)
      .on('mouseout', this.mouseOutOnCanvas);

    const brushLine = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(d => xScaleBrush(d.index))
      .y(d => yScaleBrush(d.attributes[this.state.attributeToPlot]));

    d3
      .select(brushContainer)
      .selectAll('.handle--custom')
      .remove();

    const handle = d3
      .select(brushContainer)
      .selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter()
      .append('path')
      .attr('class', 'handle--custom')
      .attr('fill', '#aaa')
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'ew-resize')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(0)
          .outerRadius(brushOffset)
          .startAngle(0)
          .endAngle((d, i) => (i ? Math.PI : -Math.PI))
      );

    d3
      .select(brushContainer)
      .select('rect.selection')
      .attr('fill', '#aaa');

    // create brush function redraw scatterplot with selection
    const brushed = () => {
      const selection = d3.event.selection;
      this.xScale.domain(selection.map(xScaleBrush.invert, xScaleBrush));
      handle.attr(
        'transform',
        (d, i) => 'translate(' + selection[i] + ',' + brushHeight / 2 + ')'
      );
      this.props.selectRow(null);
      this.plotOnCanvas();
    };

    const canvas = d3.select(elementCanvas);

    this.ctx = canvas.node().getContext('2d');

    const yExtent = d3.extent(
      this.data,
      d => d.attributes[this.state.attributeToPlot]
    );
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

    d3
      .select(brushLineElement)
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', brushLine);

    d3
      .select(brushContainer)
      .call(brush)
      .call(brush.move, this.xScale.range());

    handle.raise();

    this.xAxis = d3.axisBottom(this.xScale).tickFormat(d3.format('.0f'));
    this.yAxis = d3.axisLeft(this.yScale);
    d3.select(axisLeft).call(this.yAxis);

    this.plotOnCanvas();
  }

  pngDownload = () => {
    const self = this;
    const filename = 'Image.png'; // TODO: Dynamically set image name
    const width = this.state.containerWidth;
    const height = this.state.containerWidth; // TODO: This may not be right
    let pngExporter = tntUtils
      .png()
      .filename(filename)
      .scale_factor(1)
      .callback(function(originalPng) {
        // Need to add the points (from canvas element)
        // since pngExporter only handles the svg element
        // get the volcano plot canvas and convert to png
        let canvas = self.refs['essentialities-plot-canvas'];
        let pointsPng = canvas.toDataURL('image/png');
        // create points image
        let pointsImg = new Image();
        pointsImg.width = width;
        pointsImg.height = height;
        pointsImg.src = pointsPng;
        // create original image (svg of axes)
        let originalImg = new Image();
        originalImg.width = width;
        originalImg.height = height;
        originalImg.src = originalPng;
        // combine the images
        let combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = width;
        combinedCanvas.height = height;
        let context = combinedCanvas.getContext('2d');
        context.drawImage(originalImg, 0, 0);
        context.drawImage(pointsImg, 0, 0);
        let combinedPng = combinedCanvas.toDataURL('image/png');
        // add download behaviour
        const a = document.createElement('a');
        a.download = filename;
        a.href = combinedPng;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      // TODO: Fix the stylesheet to be just the needed (not all)
      //  .stylesheets(['components-OpenTargetsWebapp.min.css'])
      .limit({
        limit: 2100000,
        onError: function() {
          console.log('Could not create image: too large.');
        }
      });

    pngExporter(d3.select(this.refs['essentialities-plot-svg']));
  };

  highlightDefaultNode = () => {
    const scores = this.getScoresForNode(
      this.props.gene,
      this.props.model,
      this.props.data
    );
    if (scores) {
      this.highlightNode([this.props.gene, this.props.model, ...scores]);
      this.setState({
        nodeHighlighted: [this.props.gene, this.props.model]
      });
    }
  };

  defaultNodeHighlighted = () => {
    const { nodeHighlighted } = this.state;
    if (!nodeHighlighted) {
      return false;
    }
    return (
      nodeHighlighted[0] === this.props.gene &&
      nodeHighlighted[1] === this.props.model
    );
  };

  mouseOverTissue = tissue => {
    console.log(tissue);
  };

  tissueFilterElement = (tissue, key) => {
    return (
      <div>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: tissue ? colors[tissue.tissue] : '',
            width: '10px',
            height: '10px',
            borderRadius: '5px'
          }}
        />
        <span
          style={{ paddingLeft: '5px' }}
          key={key}
          onMouseOver={() => this.mouseOverTissue(tissue)}
        >
          {tissue ? tissue.tissue : ''}
        </span>
      </div>
    );
  };

  tissuesInBlocks = (tissues, blocks) => {
    const tissuesPerBlock = Math.round(tissues.length / blocks);
    if (tissues.length === 0) {
      return <div />;
    }

    return (
      <Row>
        {[...Array(blocks).keys()].map(block => (
          <Col xs={12 / blocks} key={block}>
            {[...Array(tissuesPerBlock).keys()].map(pos => {
              return this.tissueFilterElement(
                tissues[block * tissuesPerBlock + pos],
                block * tissuesPerBlock + pos
              );
            })}
          </Col>
        ))}
      </Row>
    );
  };

  render() {
    const { marginTop, marginLeft, height, brushHeight, brushOffset } = this;
    const { containerWidth, attributeToPlot } = this.state;
    const { data, gene, model, tissues, contextPage } = this.props;

    const yAxisLabel =
      this.state.attributeToPlot === 'fc_corrected'
        ? FC_CORRECTED_LABEL
        : LOSS_OF_FITNESS_SCORE_LABEL;

    const xAxisLabel = contextPage === 'gene' ? 'Cell lines' : 'Genes';

    if (!data.length) {
      return (
        <div
          id="loading"
          style={{
            width: '100%',
            marginTop: '60px',
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
      <React.Fragment>
        <div
          style={{
            display: 'inline-block',
            float: 'right',
            marginLeft: '10px',
            marginBottom: '10px'
          }}
        >
          <ButtonGroup>
            <Button
              outline
              color="secondary"
              onClick={() => this.onSelectAttributeToPlot('fc_corrected')}
              active={attributeToPlot === 'fc_corrected'}
            >
              Corrected log fold change
            </Button>
            <Button
              outline
              color="secondary"
              onClick={() => this.onSelectAttributeToPlot('bagel_bf_scaled')}
              active={attributeToPlot === 'bagel_bf_scaled'}
            >
              Loss of fitness score
            </Button>
          </ButtonGroup>
        </div>

        {gene &&
          model && (
            <div style={{ marginLeft: `${marginLeft}px` }}>
              <Button
                outline
                color="secondary"
                onClick={() => this.highlightDefaultNode()}
                active={this.defaultNodeHighlighted()}
              >
                Highlight {gene} - {model}
              </Button>
            </div>
          )}

        <div ref="plot-container">
          <svg
            ref="essentialities-plot-brush"
            style={{ paddingLeft: '25px' }}
            height={brushHeight}
            width={containerWidth + brushOffset * 2 + 1}
          >
            <path
              transform="translate(25, 0)"
              ref="essentialities-plot-brush-line"
              className="line"
              style={{
                fill: 'none',
                stroke: '#003F83',
                strokeWidth: '2px'
              }}
            />
            <g
              transform="translate(25, 0)"
              ref="essentialities-plot-brush-container"
              className="brush"
            />
          </svg>
          <div
            className="essentialities-plot-container"
            ref="essentialities-plot-container"
          >
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
              <rect
                ref="essentialities-plot-events-container"
                x={marginLeft}
                y="0"
                width={containerWidth - marginLeft}
                height={height - marginTop}
              />
              <line
                ref="essentialities-plot-xline"
                x1="0"
                x2="0"
                y1="0"
                y2={height - marginTop}
                style={{
                  display: 'none',
                  stroke: '#eeeeee',
                  strokeWidth: '2px',
                  pointerEvents: 'none'
                }}
              />
              <line
                ref="essentialities-plot-yline"
                x1={marginLeft}
                x2={containerWidth}
                y1="0"
                y2="0"
                style={{
                  display: 'none',
                  stroke: '#eeeeee',
                  strokeWidth: '2px',
                  pointerEvents: 'none'
                }}
              />
              <g ref="essentialities-plot-axis-bottom" />

              <g
                ref="essentialities-plot-axis-left"
                transform={`translate(${marginLeft},0)`}
              />

              <text
                ref="x-axis-label"
                x="0"
                y="0"
                textAnchor="middle"
                transform={`translate(${containerWidth / 2}, ${height - 10})`}
              >
                {xAxisLabel}
              </text>

              <text
                ref="y-axis-label"
                x="0"
                y="0"
                textAnchor="middle"
                transform={`translate(15, ${height / 2}) rotate(-90)`}
              >
                {yAxisLabel}
              </text>
            </svg>
            <div
              ref="essentialities-plot-tooltip"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '3px',
                boxShadow: 'gray 0px 1px 2px',
                display: 'none',
                padding: '0.3rem 0.5rem',
                pointerEvents: 'none',
                position: 'absolute',
                whiteSpace: 'nowrap',
                zIndex: 100
              }}
            />
          </div>
          <div
            style={{
              marginLeft: marginLeft,
              fontSize: '0.8em',
              cursor: 'pointer'
            }}
          >
            {contextPage === 'gene' && this.tissuesInBlocks(tissues, 3)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedEssentiality: state.rowSelected,
    tissues: state.tissues // TODO: We need to use all the tissues because this.props.data does not contain tissue information. Once it does, it would be better to take the tissues from there so we only display the tissues in the data
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
