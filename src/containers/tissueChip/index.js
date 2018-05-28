import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';
import { tableTissueFilter } from '../table/actions/table';
import { fetchTissues } from '../tissuesSummary/actions/tissues';
// import { withRouter } from 'react-router';

import { history } from '../../store/store';
import queryString from 'query-string';

class Chip extends React.Component {
  constructor(props) {
    super(props);
  }

  // getTerm = (loc, type) => {
  //   // The term can be in the pathname (table is part of the genePage or model pages
  //   // or in the search (table page)
  //   const index = loc.pathname.indexOf(`${type}/`);
  //   if (index !== -1) {
  //     const parts = loc.pathname.split('/');
  //     return parts[parts.length - 1];
  //   }
  //
  //   const search = queryString.parse(loc.search);
  //   return search[type];
  // };

  // getTissuesFromUrl = loc => {
  //   return this.getTerm(loc, 'tissue');
  // };

  tissueChanged = ev => {
    const newTissue = ev.target.value;
    // setParamsInUrl(
    //   {
    //     tissue: newTissue
    //   },
    //   history
    // );
    this.props.setTissue(newTissue);
  };

  componentDidMount() {
    // const tissue = this.getTissuesFromUrl(this.props.location);
    const { tissue } = this.props;
    // this.props.setTissue(tissue);
    this.props.fetchTissues();
    // if (!this.props.tissues.length) {
    //   this.props.fetchTissues();
    // }
  }

  render() {
    const tissuesOptions = [
      { tissue: 'No tissue selected', id: '' },
      ...this.props.tissues
    ];

    const { tissue } = this.props;

    return (
      <div>
        <FormGroup>
          <Input
            type="select"
            name="select"
            id="tissueSelect"
            value={tissue || ''}
            onChange={this.tissueChanged}
          >
            {tissuesOptions.map(t => (
              <option key={t.id} value={t.id}>
                {t.tissue}
              </option>
            ))}
          </Input>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // tissue: state.tableTissue,
    tissues: state.tissues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTissue: tissue => dispatch(tableTissueFilter(tissue)),
    fetchTissues: () => dispatch(fetchTissues())
  };
};

// const ChipWithRouter = withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(Chip)
// );

export default connect(mapStateToProps, mapDispatchToProps)(Chip);

// export default ChipWithRouter;
