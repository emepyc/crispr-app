import axios from 'axios';
import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

const paramToApiParam = {
  gene: 'gene_symbol',
  model: 'model_name'
};

function expandParams(params) {
  if (params.tissue) {
    // TODO: this is the reverse of the process happened when fetching the tissues data. There may be better alternatives to just substituting back and forth
    const tissueClean = params.tissue.split('_').join(' ');
    return axios
      .get(
        `${API_BASEURL}/models`,
        {
          params: {
            filter: `[{"name":"tissue","op":"eq","val":"${tissueClean}"}]`,
            'page[size]': 0
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

function paramToFilter(name, value) {
  if (name === 'model') {
    return {
      name: 'model_name',
      op: 'in_',
      val: Array.isArray(value) ? value : [value]
    };
  }

  if (name === 'gene') {
    return {
      name: 'gene_symbol',
      op: 'in_',
      val: [value]
    };
  }

  if (name === 'search') {
    return {
      or: [
        {
          name: 'model_name',
          op: 'contains',
          val: value
        },
        {
          name: 'gene_symbol',
          op: 'contains',
          val: value
        }
      ]
    };
  }

  if (name === 'scoreRange') {
    return {
      and: [
        {
          name: 'fc_corrected',
          op: 'lt',
          val: value[1]
        },
        {
          name: 'fc_corrected',
          op: 'gt',
          val: value[0]
        }
      ]
    };
  }

  throw `Unknown filter ${name}`;
}

// export function paramsToFilter(params) {
//   return expandParams(params).then(expandedParams => {
//     const { tissue, ...validParams } = expandedParams; // Tissue can not go in the filters
//     const paramsNoEmpty = pickBy(validParams, param => param !== undefined);
//     return Object.keys(paramsNoEmpty).map(param => {
//       return {
//         name: paramToApiParam[param],
//         op: 'in_',
//         val: Array.isArray(expandedParams[param])
//           ? [...expandedParams[param]]
//           : [expandedParams[param]]
//       };
//     });
//   });
// }

export function paramsToFilter(params) {
  return expandParams(params).then(expandedParams => {
    const { tissue, ...validParams } = expandedParams; // Tissue can not go in the filters
    const paramsNoEmpty = pickBy(validParams, identity);
    return Object.keys(paramsNoEmpty).map(param => {
      return paramToFilter(param, paramsNoEmpty[param]);
      // return {
      //   name: paramToApiParam[param],
      //   op: 'in_',
      //   val: Array.isArray(expandedParams[param])
      //     ? [...expandedParams[param]]
      //     : [expandedParams[param]]
      // };
    });
  });
}

// export function mergeFilters(filters) {
//   if (!Array.isArray(filters)) {
//     return null;
//   }
//
//   const filtersNonNull = filters.filter(identity);
//   if (!filtersNonNull) {
//     return null;
//   }
//
//   if (filtersNonNull.length === 1) {
//     return filtersNonNull;
//   }
//
//   const [first, ...rest] = filtersNonNull;
//   return rest.reduce((acc, curr) => [{and: [...acc, curr]}], first);
// }
