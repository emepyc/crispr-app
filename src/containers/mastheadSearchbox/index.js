import axios from 'axios';
import debounce from 'lodash.debounce';
import isEmpty from 'lodash.isempty';
import { Link } from 'react-router-dom';
import React from 'react';
import { Col, Row } from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import { fetchTissues } from '../../modules/actions/tissues';
import connect from 'react-redux/es/connect/connect';
import partition from 'lodash.partition';
import { history } from '../../store/store';
// import {fetchGeneInfo} from '../../modules/actions/geneInfo';

import './mastheadSearchbox.css';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

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

    this.state = {
      value: '',
      isLoading: false,
      suggestions: [],
      currentSuggestion: null
    };
  }

  componentDidMount() {
    this.props.fetchTissues();
  }

  getMatchingTissues(query) {
    const [matching] = partition(
      this.props.tissues,
      tissue => tissue.tissue.toLowerCase().indexOf(query) > -1
    );
    return matching;
  }

  getSuggestionValue = suggestion => {
    return (
      suggestion.tissue ||
      suggestion.attributes.symbol ||
      suggestion.attributes.model_name
    );
  };

  renderSuggestion = suggestion => {
    if (suggestion.type === 'gene') {
      return (
        <div
          className="search-suggestion-box text-left btn-link"
          style={{ cursor: 'pointer' }}
        >
          <span>{suggestion.attributes.symbol}</span>
        </div>
      );
    }

    if (suggestion.type === 'model') {
      return (
        <div
          className="search-suggestion-box text-left btn-link"
          style={{ cursor: 'pointer' }}
        >
          <span>{suggestion.attributes.model_name}</span>
        </div>
      );
    }

    if (suggestion.type === 'tissue') {
      return (
        <div
          className="search-suggestion-box text-left btn-link"
          style={{ cursor: 'pointer' }}
        >
          <span>{suggestion.tissue}</span>
        </div>
      );
    }
  };

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

  onSuggestionSelected = () => {
    this.setState({
      value: ''
    });

    if (this.state.currentSuggestion.tissue) {
      history.push(`/table?tissue=${this.state.currentSuggestion.tissue}`);
    } else if (this.state.currentSuggestion.attributes) {
      if (this.state.currentSuggestion.attributes.symbol) {
        history.push(`/gene/${this.state.currentSuggestion.attributes.symbol}`);
      } else if (this.state.currentSuggestion.attributes.model_name) {
        history.push(
          `/model/${this.state.currentSuggestion.attributes.model_name}`
        );
      }
    }
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
      placeholder: 'Gene or cell line',
      autoFocus: false,
      value,
      onChange: this.onChange
    };

    return (
      <Row>
        <Col xs={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }}>
          <div className="text-center searchbox-masthead-container">
            <div className="autosuggest-container z1">
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                shouldRenderSuggestions={q => q && q.length > 1}
                highlightFirstSuggestion={true}
                multiSection={true}
                getSectionSuggestions={getSectionSuggestions}
                renderSectionTitle={renderSectionTitle}
                onSuggestionHighlighted={this.onSuggestionHighlighted}
                onSuggestionSelected={this.onSuggestionSelected}
              />
            </div>
            {this.state.isLoading && (
              <span className="progress-spinner">
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            )}
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
    // fetchGeneInfo: gene => dispatch(fetchGeneInfo(gene)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
