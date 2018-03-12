import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import Autosuggest from 'react-autosuggest';
import SearchboxCss from './searchbox.css';

// TODO: For now this is hardcoded here, but needs to be retrieved asynchronously from the API (or create mock data)
const genes = [
  {
    name: 'BRAF',
    id: 'ENSG00000157764'
  },
  {
    name: 'PTEN',
    id: 'ENSG00000171862'
  }
];

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : genes.filter(
        gene => gene.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// render the suggestions
const renderSuggestion = suggestion => (
  <div className="search-suggestion-box text-left">{suggestion.name}</div>
);

class Searchbox extends React.Component {
  constructor(props) {
    super(props);

    this.gotoGenePage = this.props.gotoGenePage.bind(this);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a gene or a cell line',
      value,
      onChange: this.onChange
    };

    return (
      <div className="text-center">
        <div className="autosuggest-container">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={SearchboxCss}
          />
        </div>
        <div className="autosuggest-container search-icon-container">
          <FontAwesomeIcon icon={faSearch} />
        </div>

        <p className="intro-search-examples">
          Try:
          <a href="" onClick={() => this.gotoGenePage('BRAF')}>
            BRAF
          </a>
          <a href="" onClick={() => this.gotoGenePage('PTEN')}>
            PTEN
          </a>
        </p>
        {/*<div className='autocomplete-suggestions'>*/}
        {/*Try : <span>BRAF</span><span>PTEN</span>*/}
        {/*</div>*/}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      gotoGenePage: gene => push(`/gene/${gene}`)
    },
    dispatch
  );

// const Searchbox = () => (
//   <Form>
//     <FormGroup>
//       {/*<Label for="searchQuery">Search</Label>*/}
//       <Input type="text" name="searchQuery" id="query" placeholder="Search for a gene or cell name" />
//     </FormGroup>
//     <FontAwesomeIcon icon={faSearch} />
//
//   </Form>
// );

export default connect(null, mapDispatchToProps)(Searchbox);
