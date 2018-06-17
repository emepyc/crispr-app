import { rowSelected, geneSelected, modelSelected } from './customTable';
import {
  geneEssentialities,
  geneEssentialitiesHasErrored,
  geneEssentialitiesIsLoading
} from './geneEssentialities';
import { geneInfo, geneInfoHasErrored, geneInfoIsLoading } from './geneInfo';
import {
  modelEssentialities,
  modelEssentialitiesHasErrored,
  modelEssentialitiesIsLoading
} from './modelEssentialities';
import {
  modelInfo,
  modelInfoHasErrored,
  modelInfoIsLoading
} from './modelInfo';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { scoreRange } from './scoreRange';
import {
  analyses,
  analysesHasErrored,
  analysesIsLoading,
  tissues,
  tissuesHasErrored,
  tissuesIsLoading
} from './tissues';

import { tableStart, tableTissue } from './table';

export default combineReducers({
  routing: routerReducer,

  analyses,
  analysesHasErrored,
  analysesIsLoading,
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
  modelSelected,

  scoreRange
});
