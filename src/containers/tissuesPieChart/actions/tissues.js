import axios from 'axios';

const TISSUES_BASEURL = 'http://127.0.0.1:3111';

export function tissuesHasErrored(bool) {
  return {
    type: 'TISSUES_HAS_ERRORED',
    hasErrored: bool
  };
}
export function tissuesIsLoading(bool) {
  return {
    type: 'TISSUES_IS_LOADING',
    isLoading: bool
  };
}
export function tissuesFetchDataSuccess(tissues) {
  return {
    type: 'TISSUES_FETCH_DATA_SUCCESS',
    tissues
  };
}

export function fetchTissues() {
  // We return a function instead of an action object
  return dispatch => {
    dispatch(tissuesIsLoading(true));
    axios
      .get(`${TISSUES_BASEURL}/tissues`)
      .then(tissues => {
        tissues.data.forEach(d => (d.id = d.tissue.split(' ').join('_')));
        dispatch(tissuesIsLoading(false));
        dispatch(tissuesFetchDataSuccess(tissues.data));
      })
      .catch(() => {
        dispatch(tissuesHasErrored(true));
      });
  };
}
