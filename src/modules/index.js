import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { tissues, tissuesHasErrored, tissuesIsLoading } from './tissues';

export default combineReducers({
  routing: routerReducer,
  tissues,
  tissuesHasErrored,
  tissuesIsLoading
});
