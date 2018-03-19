import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import debounce from 'lodash/debounce';
import SearchboxCss from './searchbox.css';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

// TODO: For now this is hardcoded here, but needs to be retrieved asynchronously from the API (or create mock data)
// const genes = [
//   {
//     name: 'BRAF',
//     id: 'ENSG00000157764'
//   },
//   {
//     name: 'PTEN',
//     id: 'ENSG00000171862'
//   }
// ];

// const getSuggestions = value => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;
//
//   return inputLength === 0
//     ? []
//     : genes.filter(
//         gene => gene.name.toLowerCase().slice(0, inputLength) === inputValue
//       );
// };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// render the suggestions
// TODO: This is using direct href for linking to the gene or model page. Wouldn't it be better to use this.gotoGenePage or this.gotoModelPage instead?
const renderSuggestion = suggestion => (
  <div className="search-suggestion-box text-left">
    <a href={`/gene/${suggestion.attributes.symbol}`}>
      {suggestion.attributes.symbol || suggestion.attributes.model_name}
    </a>
  </div>
);

const getSectionSuggestions = section => section.items;

const renderSectionTitle = section => (
  <div className="text-left">
    <strong>{section.title}</strong>
  </div>
);

class Searchbox extends React.Component {
  constructor(props) {
    super(props);

    this.gotoGenePage = this.props.gotoGenePage.bind(this);

    this.loadSuggestions = debounce(this.loadSuggestions, 300);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      isLoading: false,
      suggestions: []
    };

    // this.lastRequestId = null;
  }

  loadSuggestions(value) {
    // Cancel the previous request
    // if (this.lastRequestId !== null) {
    //   clearTimeout(this.lastRequestId);
    // }

    this.setState({
      isLoading: true
    });

    // Fake request
    // this.lastRequestId = setTimeout(() => {
    //   this.setState({
    //     isLoading: false,
    //     suggestions: getMatchingLanguages(value)
    //   });
    // }, 1000);

    const genesPromise = axios
      .get(
        `${API_BASEURL}/genes?filter=[{"name":"symbol","op":"startswith","val":"${value}"}]`
      )
      .then(resp => {
        return resp.data.data.slice(0, 5);
      });

    const modelsPromise = axios
      .get(
        `${API_BASEURL}/models?filter=[{"name":"cancer_type","op":"ilike","val":"%25${value}%25"}]`
      )
      .then(resp => {
        return resp.data.data.slice(0, 5);
      });

    axios.all([genesPromise, modelsPromise]).then(resps => {
      const suggestions = [];
      if (resps[0].length) {
        suggestions.push({
          title: 'Genes',
          items: resps[0]
        });
      }
      if (resps[1].length) {
        suggestions.push({
          title: 'Cell lines',
          items: resps[1]
        });
      }
      this.setState({
        isLoading: false,
        suggestions: suggestions
      });
    });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
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
      <div className="text-center searchbox-container">
        <div className="autosuggest-container">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={SearchboxCss}
            shouldRenderSuggestions={q => q && q.length > 1}
            highlightFirstSuggestion={true}
            multiSection={true}
            getSectionSuggestions={getSectionSuggestions}
            renderSectionTitle={renderSectionTitle}
          />
        </div>
        <span className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        {this.state.isLoading && (
          <span className="progress-spinner">
            <FontAwesomeIcon icon={faSpinner} spin />
          </span>
        )}

        <p className="intro-search-examples">
          Try:
          <a href="" onClick={() => this.gotoGenePage('BRAF')}>
            BRAF
          </a>
          <a href="" onClick={() => this.gotoGenePage('PTEN')}>
            PTEN
          </a>
        </p>
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
