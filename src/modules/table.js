export function tableStart(state = 0, action) {
  switch (action.type) {
    case 'TABLE_START_CHANGED':
      return action.tableStart;

    default:
      return state;
  }
}

export function tableTissue(state = '', action) {
  switch (action.type) {
    case 'TABLE_FILTER_TISSUE':
      return action.tableTissue;

    default:
      return state;
  }
}
