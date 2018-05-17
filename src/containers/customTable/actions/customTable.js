export function rowSelected(rowData) {
  return {
    type: 'ROW_SELECTED',
    rowData
  };
}

export function selectRow(rowData) {
  return dispatch => {
    return new Promise(function(resolve) {
      dispatch(rowSelected(rowData));
      resolve();
    });
  };
}
