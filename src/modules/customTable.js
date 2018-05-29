export function rowSelected(state = null, action) {
  switch (action.type) {
    case 'ROW_SELECTED':
      return action.rowData;

    default:
      return state;
  }
}

export function geneSelected(state = null, action) {
  switch (action.type) {
    case 'GENE_SELECTED':
      return action.gene;

    default:
      return state;
  }
}

export function modelSelected(state = null, action) {
  switch (action.type) {
    case 'MODEL_SELECTED':
      return action.model;

    default:
      return state;
  }
}
