import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';
import { tableTissueFilter } from '../table/actions/table';
import { fetchTissues } from '../tissuesSummary/actions/tissues';

import { history } from '../../store/store';
import queryString from 'query-string';

class Chip extends React.Component {
  constructor(props) {
    super(props);
  }

  tissueChanged = ev => {
    setParamsInUrl(
      {
        tissue: ev.target.value
      },
      history
    );
    this.props.setTissue(ev.target.value).then(() => {
      this.props.table.ajax.reload();
    });
  };

  componentDidMount() {
    if (!this.props.tissues.length) {
      this.props.fetchTissues();
    }
  }

  render() {
    const tissuesOptions = [
      { tissue: 'No tissue selected', id: '' },
      ...this.props.tissues
    ];
    return (
      <div>
        <FormGroup>
          <Input
            type="select"
            name="select"
            id="tissueSelect"
            value={this.props.tissue}
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

const setParamsInUrl = (newParams, history) => {
  const oldQueryParams = queryString.parse(history.location.search);
  const newQueryParams = queryString.stringify({
    ...oldQueryParams,
    ...newParams
  });
  history.replace({
    ...history.location,
    search: newQueryParams
  });
};

const mapStateToProps = state => {
  return {
    tissue: state.tableTissue,
    tissues: state.tissues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTissue: tissue => dispatch(tableTissueFilter(tissue)),
    fetchTissues: () => dispatch(fetchTissues())
  };
};

// export default Chip;
export default connect(mapStateToProps, mapDispatchToProps)(Chip);
