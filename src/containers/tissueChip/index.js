import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';
import { tableTissueFilter } from '../../modules/actions/table';
import { fetchTissues } from '../../modules/actions/tissues';
import { setParamsInUrl } from '../../utils';

class Chip extends React.Component {
  constructor(props) {
    super(props);
  }

  tissueChanged = ev => {
    const newTissue = ev.target.value;
    this.props.setTissue(newTissue);
    setParamsInUrl({
      tissue: newTissue
    });
  };

  componentDidMount() {
    this.props.fetchTissues();
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
    tissues: state.tissues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTissue: tissue => dispatch(tableTissueFilter(tissue)),
    fetchTissues: () => dispatch(fetchTissues())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chip);
