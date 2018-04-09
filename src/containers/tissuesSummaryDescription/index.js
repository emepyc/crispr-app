import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import IconLoop from '../iconLoop';
import PetriDiagram from './petri-diagram.png';
import Organ1 from './organ-1.png';
import Organ2 from './organ-2.png';
import Organ3 from './organ-3.png';
import Organ4 from './organ-4.png';
import Organ5 from './organ-5.png';
import Organ6 from './organ-6.png';
import Organ7 from './organ-7.png';
import Organ8 from './organ-8.png';
import Organ9 from './organ-9.png';
import './tissuesSummaryDescription.css';

class TissuesSummaryDesc extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icon1 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ1} alt="Cell line" />
      </span>
    );
    const icon2 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ2} alt="Cell line" />
      </span>
    );
    const icon3 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ3} alt="Cell line" />
      </span>
    );
    const icon4 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ4} alt="Cell line" />
      </span>
    );
    const icon5 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ5} alt="Cell line" />
      </span>
    );
    const icon6 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ6} alt="Cell line" />
      </span>
    );
    const icon7 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ7} alt="Cell line" />
      </span>
    );
    const icon8 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ8} alt="Cell line" />
      </span>
    );
    const icon9 = (
      <span style={{ marginRight: '15px' }}>
        <img height={'50px'} width={'50px'} src={Organ9} alt="Cell line" />
      </span>
    );

    return (
      <div>
        <div>
          <span style={{ marginRight: '15px' }}>
            <img
              height={'50px'}
              width={'50px'}
              src={PetriDiagram}
              alt="Cell line"
            />
          </span>
          {this.props.nmodels} cell lines.
        </div>
        <div style={{ marginTop: '15px' }}>
          {/*<span style={{'margin-right': '15px'}}><img height={'50px'} width={'50px'} src={Organ2} alt="Cell line"/></span>{this.props.ntissues} tissues.*/}
          <IconLoop>
            {icon1}
            {icon2}
            {icon3}
            {icon4}
            {icon5}
            {icon6}
            {icon7}
            {icon8}
            {icon9}
          </IconLoop>
          <span>{this.props.ntissues} tissues.</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ntissues: state.tissues.length,
    nmodels: d3.sum(state.tissues, t => t.counts)
  };
};

export default connect(mapStateToProps)(TissuesSummaryDesc);
