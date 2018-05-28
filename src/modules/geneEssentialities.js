export function geneEssentialitiesHasErrored(state = false, action) {
  switch (action.type) {
    case 'GENE_ESSENTIALITIES_HAS_ERRORED':
      return action.hasErrored;

    default:
      return state;
  }
}

export function geneEssentialitiesIsLoading(state = false, action) {
  switch (action.type) {
    case 'GENE_ESSENTIALITIES_IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function geneEssentialities(state = [], action) {
  switch (action.type) {
    case 'GENE_ESSENTIALITIES_FETCH_DATA_SUCCESS':
      return action.geneEssentialities;

    default:
      return state;
  }
}
