import axios from 'axios';
import debounce from 'lodash.debounce';
import isEmpty from 'lodash.isempty';
import partition from 'lodash.partition';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { fetchTissues } from '../../modules/actions/tissues';
import { history } from '../../store/store';
import './searchbox.css';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// render the suggestions
const renderSuggestion = suggestion => {
  if (suggestion.type === 'gene') {
    return (
      <Link to={`/gene/${suggestion.attributes.symbol}`}>
        <div className="search-suggestion-box text-left">
          <span>{suggestion.attributes.symbol}</span>
        </div>
      </Link>
    );
  }

  if (suggestion.type === 'model') {
    return (
      <Link to={`/model/${suggestion.attributes.model_name}`}>
        <div className="search-suggestion-box" style={{ position: 'relative' }}>
          <div className="text-left" style={{ position: 'absolute' }}>
            {suggestion.attributes.model_name}
          </div>
          <div className={'suggestions-description text-right'}>
            {suggestion.attributes.name}
            Tissue: {suggestion.attributes.tissue}
          </div>
        </div>
      </Link>
    );
  }

  if (suggestion.type === 'tissue') {
    return (
      <Link to={`/table?tissue=${suggestion.id}`}>
        <div className="search-suggestion-box text-left">
          <span>{suggestion.tissue}</span>
        </div>
      </Link>
    );
  }
};

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
      suggestions: [],
      currentSuggestion: null
    };

    // this.lastRequestId = null;
  }

  componentDidMount() {
    this.props.fetchTissues();
  }

  getMatchingTissues(query) {
    const [matching, other] = partition(
      this.props.tissues,
      tissue => tissue.tissue.toLowerCase().indexOf(query) > -1
    );
    return matching;
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
        `${API_BASEURL}/models?filter=[{"name": "model_name","op":"startswith","val":"${value}"}]`
      )
      .then(resp => {
        return resp.data.data.slice(0, 5);
      });

    const modelsFromTissuePromise = axios
      .get(
        `${API_BASEURL}/models?filter=[{"name":"cancer_type","op":"ilike","val":"%25${value}%25"}]`
      )
      .then(resp => {
        return resp.data.data.slice(0, 5);
      });

    axios
      .all([genesPromise, modelsPromise, modelsFromTissuePromise])
      .then(resps => {
        const geneSuggestions = resps[0].length ? resps[0] : [];
        const modelSuggestions = [
          ...(resps[1].length ? resps[1] : []),
          ...(resps[2].length ? resps[2] : [])
        ];

        const tissuesSuggestions = this.getMatchingTissues(value.toLowerCase());
        const tissuesSuggestionsWithType = tissuesSuggestions.map(tissue => {
          return { ...tissue, type: 'tissue' };
        });
        const suggestions = [
          geneSuggestions.length
            ? { title: 'Genes', items: geneSuggestions }
            : {},
          modelSuggestions.length
            ? { title: 'Models', items: modelSuggestions }
            : {},
          tissuesSuggestionsWithType.length
            ? { title: 'Tissues', items: tissuesSuggestionsWithType }
            : {}
        ];

        const suggestionsNotEmpty = suggestions.filter(
          suggestion => !isEmpty(suggestion)
        );

        this.setState({
          isLoading: false,
          suggestions: suggestionsNotEmpty,
          currentSuggestion: suggestionsNotEmpty.length
            ? suggestionsNotEmpty[0].items[0].symbol ||
              suggestionsNotEmpty[0].items[0].symbol
            : ''
        });
      });
  }

  upDownOption = method => {
    const suggestions = this.state.suggestions;

    if (!this.state.currentSuggestion) {
      return (
        suggestions[0].items[0].attributes.symbol ||
        suggestions[0].items[0].attributes.model_name
      );
    }
    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      for (let j = 0; j < suggestion.items.length; j++) {
        const item = suggestion.items[j];
        const sameTissue = item.tissue === this.state.currentSuggestion.tissue;
        const sameGene = this.state.currentSuggestion.attributes
          ? item.attributes.symbol ===
            this.state.currentSuggestion.attributes.symbol
          : true;
        const sameModel = this.state.currentSuggestion.attributes
          ? item.attributes.model_name ===
            this.state.currentSuggestion.attributes.model_name
          : true;
        if (sameTissue && sameGene && sameModel) {
          let nexti;
          let nextj;
          if (method === 'up') {
            nexti = i;
            nextj = j - 1;
            if (nextj === -1) {
              if (i === 0) {
                nexti = suggestions.length - 1;
              } else {
                nexti = i - 1;
              }
              nextj = suggestions[nexti].items.length - 1;
            }
          }
          if (method === 'down') {
            nexti = i;
            nextj = j + 1;
            if (nextj === suggestion.items.length) {
              nextj = 0;
              if (i < suggestions.length - 1) {
                nexti = i + 1;
              } else {
                nexti = 0;
              }
            }
          }
          return (
            suggestions[nexti].items[nextj].tissue ||
            suggestions[nexti].items[nextj].attributes.symbol ||
            suggestions[nexti].items[nextj].attributes.model_name
          );
        }
      }
    }
  };

  onChange = (event, { newValue, method }) => {
    if (method === 'down' || method === 'up') {
      // newValue = this.state.suggestions[0].items[0].attributes.symbol || this.state.suggestions[0].items[0].attributes.model_name;
      newValue = this.upDownOption(method);
    }
    if (method === 'enter') {
      if (this.state.currentSuggestion.tissue) {
        history.push(`/table?tissue=${this.state.currentSuggestion.tissue}`);
      } else if (this.state.currentSuggestion.attributes) {
        if (this.state.currentSuggestion.attributes.symbol) {
          history.push(
            `/gene/${this.state.currentSuggestion.attributes.symbol}`
          );
        } else if (this.state.currentSuggestion.attributes.model_name) {
          history.push(
            `/model/${this.state.currentSuggestion.attributes.model_name}`
          );
        }
      }
    }
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

  onSuggestionHighlighted = ({ suggestion }) => {
    if (suggestion) {
      this.setState({
        currentSuggestion: suggestion
      });
    }
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a gene, cell line or tissue name',
      autoFocus: true,
      value,
      onChange: this.onChange
    };

    return (
      <Row>
        <Col xs={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }}>
          <div className="text-center searchbox-container">
            <div className="autosuggest-container z1">
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
                onSuggestionHighlighted={this.onSuggestionHighlighted}
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
              <Link to={'/table?tissue=Breast'}>Breast</Link>
              <span style={{ marginLeft: '20px' }}>
                Or:<Link to={'/table'}>explore all the data</Link>
              </span>
            </p>
          </div>
        </Col>
      </Row>
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
    fetchTissues: () => dispatch(fetchTissues())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
// export default Searchbox;
