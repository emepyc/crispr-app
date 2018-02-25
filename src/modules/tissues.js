export function tissuesHasErrored(state = false, action) {
  switch (action.type) {
    case 'TISSUES_HAS_ERRORED':
      return action.hasErrored;

    default:
      return state;
  }
}

export function tissuesIsLoading(state = false, action) {
  switch (action.type) {
    case 'TISSUES_IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function tissues(state = [], action) {
  switch (action.type) {
    case 'TISSUES_FETCH_DATA_SUCCESS':
      return action.tissues;

    default:
      return state;
  }
}
