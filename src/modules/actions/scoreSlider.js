export function scoreRange(range) {
  return {
    type: 'SCORE_RANGE',
    range
  };
}

export function scoreExtent(extent) {
  return {
    type: 'SCORE_EXTENT',
    extent
  };
}
