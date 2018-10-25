import queryString from 'qs';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import { history } from './store/store';

function getTerm(loc, type) {
  // The term can be in the pathname (table is part of the genePage or model pages
  // or in the search (table page)
  const index = loc.pathname.indexOf(`${type}/`);
  if (index !== -1) {
    const parts = loc.pathname.split('/');
    return parts[parts.length - 1];
  }

  const search = queryString.parse(
    loc.search.indexOf('?') === 0 ? loc.search.substring(1) : loc.search
  );
  return search[type];
}

export function getParamsFromUrl(loc) {
  const gene = getTerm(loc, 'gene');
  const model = getTerm(loc, 'model');
  const tissue = getTerm(loc, 'tissue');

  return pickBy({ gene, model, tissue }, identity);
}

export function setParamsInUrl(newParams) {
  const oldParams = queryString.parse(history.location.search);
  const oldParamsClean = Object.keys(oldParams).reduce((acc, paramName) => {
    if (paramName.indexOf('?') === 0) {
      return {
        ...acc,
        [paramName.substring(1)]: oldParams[paramName]
      };
    }
    return {
      ...acc,
      [paramName]: oldParams[paramName]
    };
  }, {});

  const newQueryParams = queryString.stringify({
    ...oldParamsClean,
    ...newParams
  });
  history.replace({
    ...history.location,
    search: newQueryParams
  });
}
