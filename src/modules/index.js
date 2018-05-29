import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { tissues, tissuesHasErrored, tissuesIsLoading } from './tissues';
import { geneInfo, geneInfoHasErrored, geneInfoIsLoading } from './geneInfo';
import {
  modelInfo,
  modelInfoHasErrored,
  modelInfoIsLoading
} from './modelInfo';
import {
  geneEssentialities,
  geneEssentialitiesHasErrored,
  geneEssentialitiesIsLoading
} from './geneEssentialities';
import {
  modelEssentialities,
  modelEssentialitiesHasErrored,
  modelEssentialitiesIsLoading
} from './modelEssentialities';
import { rowSelected, geneSelected, modelSelected } from './customTable';

import { tableStart, tableTissue } from './table';

export default combineReducers({
  routing: routerReducer,
  tissues,
  tissuesHasErrored,
  tissuesIsLoading,

  geneInfo,
  geneInfoHasErrored,
  geneInfoIsLoading,

  modelInfo,
  modelInfoHasErrored,
  modelInfoIsLoading,

  geneEssentialities,
  geneEssentialitiesHasErrored,
  geneEssentialitiesIsLoading,

  modelEssentialities,
  modelEssentialitiesHasErrored,
  modelEssentialitiesIsLoading,

  tableStart,
  tableTissue,

  rowSelected,
  geneSelected,
  modelSelected
});
