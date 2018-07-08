export function scoreRange(state = null, action) {
  switch (action.type) {
    case 'SCORE_RANGE':
      return action.range;

    default:
      return state;
  }
}

export function scoreExtent(state = [-9, 9], action) {
  switch (action.type) {
    case 'SCORE_EXTENT':
      return action.extent;

    default:
      return state;
  }
}
