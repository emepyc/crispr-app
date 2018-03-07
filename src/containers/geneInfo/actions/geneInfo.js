import axios from 'axios';

const GENE_INFO_BASEURL = 'http://127.0.0.1:3111';

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
  console.log(`gene to get info... ${gene}`);
  return dispatch => {
    dispatch(geneInfoIsLoading(true));
    axios
      .get(`${GENE_INFO_BASEURL}/geneInfo/${gene}`)
      .then(geneInfo => {
        dispatch(geneInfoIsLoading(false));
        dispatch(geneInfoFetchDataSuccess(geneInfo));
      })
      .catch(() => {
        console.log('catched!!');
        dispatch(geneInfoHasErrored(true));
      });
  };
}
