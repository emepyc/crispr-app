import axios from 'axios';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

export function modelInfoHasErrored(bool) {
  return {
    type: 'MODEL_INFO_HAS_ERRORED',
    hasErrored: bool
  };
}

export function modelInfoIsLoading(bool) {
  return {
    type: 'MODEL_INFO_IS_LOADING',
    isLoading: bool
  };
}

export function modelInfoFetchDataSuccess(modelInfo) {
  return {
    type: 'MODEL_INFO_FETCH_DATA_SUCCESS',
    modelInfo
  };
}

export function fetchModelInfo(model) {
  return dispatch => {
    dispatch(modelInfoIsLoading(true));
    axios
      .get(`${API_BASEURL}/models/${model}`, {
        responseType: 'json'
      })
      .then(modelInfo => {
        dispatch(modelInfoIsLoading(false));
        dispatch(modelInfoFetchDataSuccess(modelInfo.data));
      })
      .catch(() => {
        dispatch(modelInfoHasErrored(true));
      });
  };
}
