export function selectRow(rowData) {
  return {
    type: 'ROW_SELECTED',
    rowData
  };
}

export function selectGene(gene) {
  return {
    type: 'GENE_SELECTED',
    gene
  };
}

export function selectModel(model) {
  return {
    type: 'MODEL_SELECTED',
    model
  };
}
