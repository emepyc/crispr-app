// Table pagination start
export function tableStartHasChanged(tableStart) {
  return {
    type: 'TABLE_START_CHANGED',
    tableStart
  };
}

export function tableStartChanged(n) {
  return dispatch => {
    return dispatch(tableStartHasChanged(n));
  };
}

// Table filter by tissue
export function tableTissueHasChanged(tableTissue) {
  return {
    type: 'TABLE_FILTER_TISSUE',
    tableTissue
  };
}

export function tableTissueFilter(tissue) {
  return dispatch => {
    return new Promise(function(resolve) {
      dispatch(tableTissueHasChanged(tissue));
      resolve();
    });
  };
}
