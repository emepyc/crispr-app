import axios from 'axios';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

export function geneInfoHasErrored(bool) {
  return {
    type: 'GENE_INFO_HAS_ERRORED',
    hasErrored: bool
  };
}

export function geneInfoIsLoading(bool) {
  return {
    type: 'GENE_INFO_IS_LOADING',
    isLoading: bool
  };
}

export function geneInfoFetchDataSuccess(geneInfo) {
  return {
    type: 'GENE_INFO_FETCH_DATA_SUCCESS',
    geneInfo
  };
}

export function fetchGeneInfo(gene) {
  console.log('fetching gene info...');
  return dispatch => {
    dispatch(geneInfoIsLoading(true));
    console.log('gene is loading (true)');
    axios
      .get(`${API_BASEURL}/genes/${gene}`, {
        responseType: 'json'
      })
      .then(geneInfo => {
        dispatch(geneInfoIsLoading(false));
        console.log('gene is not loading (false)');
        dispatch(geneInfoFetchDataSuccess(geneInfo.data));
        console.log('gene info data dispatched');
      })
      .catch(() => {
        dispatch(geneInfoHasErrored(true));
        console.log('gene info has errored!!! (true)');
      });
  };
}
