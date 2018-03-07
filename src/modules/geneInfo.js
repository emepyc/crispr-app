export function geneInfoHasErrored(state = false, action) {
  switch (action.type) {
    case 'GENE_INFO_HAS_ERRORED':
      return action.hasErrored;

    default:
      return state;
  }
}

export function geneInfoIsLoading(state = false, action) {
  switch (action.type) {
    case 'GENE_INFO_IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function geneInfo(state = {}, action) {
  switch (action.type) {
    case 'GENE_INFO_FETCH_DATA_SUCCESS':
      return action.geneInfo;

    default:
      return state;
  }
}
