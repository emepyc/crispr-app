import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { tissues, tissuesHasErrored, tissuesIsLoading } from './tissues';
import { geneInfo, geneInfoHasErrored, geneInfoIsLoading } from './geneInfo';
import {
  geneEssentialities,
  geneEssentialitiesHasErrored,
  geneEssentialitiesIsLoading
} from './geneEssentialities';

export default combineReducers({
  routing: routerReducer,
  tissues,
  tissuesHasErrored,
  tissuesIsLoading,

  geneInfo,
  geneInfoHasErrored,
  geneInfoIsLoading,

  geneEssentialities,
  geneEssentialitiesHasErrored,
  geneEssentialitiesIsLoading
});
