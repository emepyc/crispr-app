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
