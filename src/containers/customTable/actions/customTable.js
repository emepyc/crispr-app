export function rowSelected(rowData) {
  return {
    type: 'ROW_SELECTED',
    rowData
  };
}

export function geneSelected(gene) {
  return {
    type: 'GENE_SELECTED',
    gene
  };
}

export function modelSelected(model) {
  return {
    type: 'MODEL_SELECTED',
    model
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

export function setGene(gene) {
  return dispatch => {
    return new Promise(function(resolve) {
      dispatch(geneSelected(gene));
      resolve();
    });
  };
}

export function setModel(model) {
  return dispatch => {
    return new Promise(function(resolve) {
      dispatch(modelSelected(model));
      resolve();
    });
  };
}
