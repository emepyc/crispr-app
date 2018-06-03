import axios from 'axios';
import { paramsToFilter } from '../../fetch';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

export function modelEssentialitiesHasErrored(bool) {
  return {
    type: 'MODEL_ESSENTIALITIES_HAS_ERRORED',
    hasErrored: bool
  };
}

export function modelEssentialitiesIsLoading(bool) {
  return {
    type: 'MODEL_ESSENTIALITIES_IS_LOADING',
    isLoading: bool
  };
}

export function modelEssentialitiesFetchDataSuccess(modelEssentialities) {
  return {
    type: 'MODEL_ESSENTIALITIES_FETCH_DATA_SUCCESS',
    modelEssentialities
  };
}

export function fetchModelEssentialities(model) {
  return dispatch => {
    const params = {
      model
    };
    return paramsToFilter(params).then(filters => {
      return axios
        .get(`${API_BASEURL}/models/${model}/datasets/crispr`, {
          params: {
            filter: JSON.stringify(filters),
            'page[size]': 0
          }
        })
        .then(modelEssentialities => {
          dispatch(modelEssentialitiesIsLoading(false));
          dispatch(
            modelEssentialitiesFetchDataSuccess(modelEssentialities.data.data)
          );
        })
        .catch(() => {
          dispatch(modelEssentialitiesHasErrored(true));
        });
    });
  };
}
