export function modelEssentialitiesHasErrored(state = false, action) {
  switch (action.type) {
    case 'MODEL_ESSENTIALITIES_HAS_ERRORED':
      return action.hasErrored;

    default:
      return state;
  }
}

export function modelEssentialitiesIsLoading(state = false, action) {
  switch (action.type) {
    case 'MODEL_ESSENTIALITIES_IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function modelEssentialities(state = [], action) {
  switch (action.type) {
    case 'MODEL_ESSENTIALITIES_FETCH_DATA_SUCCESS':
      return action.modelEssentialities;

    default:
      return state;
  }
}
