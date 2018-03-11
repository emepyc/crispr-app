const Chance = require('chance');

// Instantiate Chance so it can be used
const chance = new Chance();

const genes = [
  "BRAF",
  "PTEN",
  "A1B0",
  "TP53"
];

function randomModel() {
  let modelId = '';
  modelId += chance.character({"pool": "ABCD"});
  modelId += chance.integer({min:1000, max:9999});
  // randomModels.push(modelId);
  return modelId;
}

function randomLog() {
  const zmii = 1.3;
  const max = 10;
  return -Math.log(Math.floor(Math.log((Math.random()*(Math.pow(zmii, max)-1.0))+1.0) / Math.log(zmii)));
}

module.exports = exports = {
  gene() {
    return chance.pickone(genes);
  },
  corrected_fold_change() {
    return randomLog();
  },
  model() {
    // return chance.pickone(randomModels);
    return randomModel();
  },
  normalised_essentiality() {
    return randomLog();
  }
};
