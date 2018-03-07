import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { tissues, tissuesHasErrored, tissuesIsLoading } from './tissues';
import { geneInfo, geneInfoHasErrored, geneInfoIsLoading } from './geneInfo';

export default combineReducers({
  routing: routerReducer,
  tissues,
  tissuesHasErrored,
  tissuesIsLoading,

  geneInfo,
  geneInfoHasErrored,
  geneInfoIsLoading
});
