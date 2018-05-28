import axios from 'axios';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

const paramToApiParam = {
  gene: 'gene_symbol',
  model: 'model_name'
};

function expandParams(params) {
  console.log('params to expand...');
  console.log(params);
  if (params.tissue) {
    console.log('expanding tissues with tissue...');
    console.log(params);
    // TODO: this is the reverse of the process happened when fetching the tissues data. There may be better alternatives to just substituting back and forth
    const tissueClean = params.tissue.split('_').join(' ');
    return axios
      .get(
        `${API_BASEURL}/models`,
        {
          params: {
            filter: [
              {
                name: 'tissue',
                op: 'eq',
                vale: tissueClean
              }
            ]
          }
        }
        // `${API_BASEURL}/models?filter=[{"name":"tissue","op":"eq","val":"${tissueClean}"}]`
      )
      .then(resp => {
        return {
          ...params,
          model: [
            ...(params.model || []),
            ...resp.data.data.map(rec => rec.attributes.model_name)
          ]
        };
      });
  }
  return Promise.resolve(params);
}

export function paramsToFilter(params) {
  return expandParams(params).then(expandedParams => {
    const { tissue, ...validParams } = expandedParams; // Tissue can not go in the filters
    console.log('paramsNoEmpty');
    const paramsNoEmpty = pickBy(validParams, param => param !== undefined);
    console.log(paramsNoEmpty);
    return Object.keys(paramsNoEmpty).map(param => {
      return {
        name: paramToApiParam[param],
        op: 'in_',
        val: Array.isArray(expandedParams[param])
          ? [...expandedParams[param]]
          : [expandedParams[param]]
      };
    });
  });
}
