export function rowSelected(state = null, action) {
  switch (action.type) {
    case 'ROW_SELECTED':
      return action.rowData;

    default:
      return state;
  }
}
