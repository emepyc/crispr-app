export function scoreRange(state = null, action) {
  switch (action.type) {
    case 'SCORE_RANGE':
      return action.range;

    default:
      return state;
  }
}
