import React from 'react';
import { Link } from 'react-router-dom';
// import {push} from 'react-router-redux';
// import {bindActionCreators} from 'redux';
// import {connect} from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './searchbox.css';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// render the suggestions
const renderSuggestion = suggestion => (
  <Link to={`/gene/${suggestion.attributes.symbol}`}>
    <div className="search-suggestion-box text-left">
      <span>
        {suggestion.attributes.symbol || suggestion.attributes.model_name}
      </span>
      <span className={'suggestions-description pull-right'}>
        {suggestion.attributes.symbol && (
          <span>{suggestion.attributes.name}</span>
        )}
        {suggestion.attributes.model_name && (
          <span>Tissue: {suggestion.attributes.tissue}</span>
        )}
      </span>
    </div>
  </Link>
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
      placeholder: 'Type a genePage or a cell line',
      autoFocus: true,
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
          <Link to={'/gene/BRAF'}>BRAF</Link>
          <Link to={'/gene/PTEN'}>PTEN</Link>
          <Link to={'/model/SNU-C1'}>SNU-C1</Link>
        </p>
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       gotoGenePage: genePage => push(`/genePage/${genePage}`)
//     },
//     dispatch
//   );
//
// export default connect(null, mapDispatchToProps)(Searchbox);
export default Searchbox;
