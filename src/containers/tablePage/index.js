import React from 'react';
import { Container } from 'reactstrap';
import CustomTable from '../customTable';
import Filters from '../filters';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { tableTissueFilter } from '../../modules/actions/table';
import { getParamsFromUrl, setParamsInUrl } from '../../utils';

class TablePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tissue: null
    };
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.tissue === this.props.tissue) {
    //   console.log(`no update the table page because tissues have not changed`);
    //   return;
    // }
    // const { tissue } = this.props;
    // this.setState({
    //   tissue
    // });
    // setParamsInUrl({
    //   tissue
    // });
  }

  componentDidMount() {
    const params = getParamsFromUrl(this.props.location);
    this.setState({
      tissue: params.tissue
    });
    if (params.tissue) {
      this.props.setTissue(params.tissue);
    }
  }

  render() {
    const { tissue } = this.props;
    const tissueLoc = this.state.tissue;
    return (
      <Container style={{ minHeight: '500px' }}>
        <div className="section" style={{ marginTop: '20px' }}>
          <Filters tablePage tissue={tissue || tissueLoc} />
        </div>
        <CustomTable
          tissue={tissue || tissueLoc}
          columns={['gene', 'model', 'logFC', 'lossOfFitnessScore']}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    tissue: state.tableTissue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTissue: tissue => dispatch(tableTissueFilter(tissue))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TablePage)
);
