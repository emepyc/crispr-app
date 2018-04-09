import React from 'react';
import * as d3 from 'd3';

class iconLoop extends React.Component {
  constructor(props) {
    super(props);

    const duration = 500;
    this.state = {
      duration,
      pos: 0,
      stay: false,
      opacity: 1,
      timer: d3.timer(this.rotateElem),
      scale: d3
        .scaleLinear()
        .domain([0, duration])
        .range([1, 0])
        .clamp(true)
    };
  }

  rotateElem = t => {
    if (t > this.state.duration * (this.state.stay ? 4 : 1)) {
      this.state.timer.stop();
      if (this.state.scale.range()[0] === 1) {
        this.setState({
          pos: this.state.pos + 1,
          stay: true,
          timer: d3.timer(this.rotateElem),
          scale: d3
            .scaleLinear()
            .domain([0, this.state.duration])
            .range([0, 1])
        });
      } else {
        this.setState({
          stay: false,
          timer: d3.timer(this.rotateElem),
          scale: d3
            .scaleLinear()
            .domain([0, this.state.duration])
            .range([1, 0])
        });
      }
      // this.state.timer.restart(this.rotateElem);
      return;
    }
    const opacity = this.state.scale(t);
    this.setState({
      opacity
    });
  };

  componentWillUnmount() {
    this.state.timer.stop();
  }

  render() {
    return (
      <span style={{ opacity: this.state.opacity }}>
        {this.props.opacity}
        {
          this.props.children[
            this.state.pos % React.Children.count(this.props.children)
          ]
        }
      </span>
    );
  }
}

export default iconLoop;
