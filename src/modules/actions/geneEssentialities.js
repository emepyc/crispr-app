import axios from 'axios';
import { paramsToFilter } from '../../fetch';

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

export function fetchGeneEssentialities(gene, tissue) {
  return dispatch => {
    const params = {
      gene,
      tissue
    };
    return paramsToFilter(params).then(filters => {
      return axios
        .get(`${API_BASEURL}/genes/${gene}/datasets/crispr`, {
          params: {
            sort: 'fc_corrected',
            filter: JSON.stringify(filters),
            'page[size]': 0
          }
        })
        .then(geneEssentialities => {
          dispatch(geneEssentialitiesIsLoading(false));
          dispatch(
            geneEssentialitiesFetchDataSuccess(geneEssentialities.data.data)
          );
        })
        .catch(() => {
          dispatch(geneEssentialitiesHasErrored(true));
        });
    });
  };
}
