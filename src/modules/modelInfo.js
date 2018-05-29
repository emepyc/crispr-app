export function modelInfoHasErrored(state = false, action) {
  switch (action.type) {
    case 'MODEL_INFO_HAS_ERRORED':
      return action.hasErrored;

    default:
      return state;
  }
}

export function modelInfoIsLoading(state = false, action) {
  switch (action.type) {
    case 'MODEL_INFO_IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function modelInfo(state = {}, action) {
  switch (action.type) {
    case 'MODEL_INFO_FETCH_DATA_SUCCESS':
      return action.modelInfo;

    default:
      return state;
  }
}
