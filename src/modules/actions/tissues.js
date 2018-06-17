import axios from 'axios';
import reduce from 'lodash.reduce';
// import snakeCase from 'lodash.snakecase';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

export function analysesHasErrored(bool) {
  return {
    type: 'ANALYSES_HAS_ERRORED',
    hasErrored: bool
  };
}
export function analysesIsLoading(bool) {
  return {
    type: 'ANALYSES_IS_LOADING',
    isLoading: bool
  };
}
export function analysesFetchDataSuccess(analyses) {
  return {
    type: 'ANALYSES_FETCH_DATA_SUCCESS',
    analyses
  };
}

export function fetchAnalyses() {
  return dispatch => {
    dispatch(analysesIsLoading(true));
    axios
      .get(`${API_BASEURL}/analyses`)
      .then(resp => {
        console.log('analyses response...');
        console.log(resp);
        dispatch(analysesIsLoading(false));
        dispatch(analysesFetchDataSuccess(resp.data));
      })
      .catch(err => {
        console.log('error loading analyses!');
        console.log(err);
        dispatch(analysesHasErrored(true));
      });
  };
}

export function tissuesHasErrored(bool) {
  return {
    type: 'TISSUES_HAS_ERRORED',
    hasErrored: bool
  };
}
export function tissuesIsLoading(bool) {
  return {
    type: 'TISSUES_IS_LOADING',
    isLoading: bool
  };
}
export function tissuesFetchDataSuccess(tissues) {
  return {
    type: 'TISSUES_FETCH_DATA_SUCCESS',
    tissues
  };
}

function getTissueToColor(analyses) {
  return reduce(
    analyses,
    (acc, value) => {
      return {
        ...acc,
        [value.label]: value.color
      };
    },
    {}
  );
}

export function fetchTissues() {
  return dispatch => {
    dispatch(tissuesIsLoading(true));
    axios
      .get(`${API_BASEURL}/analyses`)
      .then(resp => {
        const tissueToColor = getTissueToColor(resp.data);
        return axios.get(`${API_BASEURL}/models?page[size]=0`).then(models => {
          const tissuesObj = {};
          // TODO: Convert to functional
          models.data.data.forEach(m => {
            if (m.attributes.tissue) {
              const color = tissueToColor[m.attributes.tissue];
              const id = m.attributes.tissue.split(' ').join('_');
              // const id = snakeCase(m.attributes.tissue);
              if (!tissuesObj[id]) {
                tissuesObj[id] = {
                  counts: 0,
                  color,
                  label: m.attributes.tissue
                };
              }
              tissuesObj[id].counts += 1;
            }
          });
          const tissues = [];
          Object.keys(tissuesObj).forEach(id => {
            tissues.push({
              tissue: tissuesObj[id].label,
              id: id,
              color: tissuesObj[id].color,
              counts: tissuesObj[id].counts
            });
          });
          dispatch(tissuesIsLoading(false));
          dispatch(tissuesFetchDataSuccess(tissues));
        });
      })
      .catch(() => dispatch(tissuesHasErrored(true)));
  };
}
