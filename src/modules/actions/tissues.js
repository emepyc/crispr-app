import axios from 'axios';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

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
      .get(`${API_BASEURL}/models?page[size]=0`)
      .then(models => {
        const tissuesObj = {};
        models.data.data.forEach(m => {
          if (m.attributes.tissue) {
            const id = m.attributes.tissue.split(' ').join('_');
            if (!tissuesObj[id]) {
              tissuesObj[id] = {
                counts: 0,
                label: m.attributes.tissue
              };
            }
            tissuesObj[id].counts += 1;
          }
        });
        const tissues = [];
        Object.keys(tissuesObj).forEach(id => {
          tissues.push({
            tissue: tissuesObj[id].label,
            id: id,
            counts: tissuesObj[id].counts
          });
        });
        dispatch(tissuesIsLoading(false));
        dispatch(tissuesFetchDataSuccess(tissues));
      })
      .catch(() => {
        dispatch(tissuesHasErrored(true));
      });
  };
}
