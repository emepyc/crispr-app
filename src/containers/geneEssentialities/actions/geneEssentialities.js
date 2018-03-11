import axios from 'axios';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

export function geneEssentialitiesHasErrored(bool) {
  return {
    type: 'GENE_ESSENTIALITIES_HAS_ERRORED',
    hasErrored: bool
  };
}

export function geneEssentialitiesIsLoading(bool) {
  return {
    type: 'GENE_ESSENTIALITIES_IS_LOADING',
    isLoading: bool
  };
}

export function geneEssentialitiesFetchDataSuccess(geneEssentialities) {
  return {
    type: 'GENE_ESSENTIALITIES_FETCH_DATA_SUCCESS',
    geneEssentialities
  };
}

export function fetchGeneEssentialities(gene) {
  return dispatch => {
    dispatch(geneEssentialitiesIsLoading(true));
    axios
      .get(`${API_BASEURL}/genes/${gene}/datasets/crispr`)
      .then(geneEssentialities => {
        dispatch(geneEssentialitiesIsLoading(false));
        dispatch(geneEssentialitiesFetchDataSuccess(geneEssentialities.data));
      })
      .catch(() => {
        dispatch(geneEssentialitiesHasErrored(true));
      });
  };
}
