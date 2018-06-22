import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import React from 'react';
import isEmpty from 'lodash.isempty';

function getEssentialities(attributes, analyses) {
  return Object.keys(attributes).reduce((acc, curr) => {
    const index = curr.indexOf('adm_status_');
    if (index > -1 && attributes[curr]) {
      const cancerType = curr.substr(11, curr.length - index);
      return [...acc, analyses[cancerType].label];
    }
    return acc;
  }, []);
}

export function SignificantCancerTypesSummary(props) {
  const { width, height, gene, analyses } = props;

  if (!props.gene.data || isEmpty(props.analyses)) {
    return <div />;
  }

  const cancerTypesEssentialities = getEssentialities(
    gene.data.attributes,
    analyses
  );

  const margin = {
    top: 1,
    left: 1,
    right: 1,
    bottom: 1
  };

  const total = Object.keys(props.analyses).length;
  const significant = cancerTypesEssentialities.length;

  const radius = Math.min(width, height) / 2;
  return (
    <React.Fragment>
      <div>
        Essential in <b>{significant}</b> cancer types
      </div>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              { pos: 1, number: total - significant },
              { pos: 0, number: significant }
            ]}
            pieValue={d => d.number}
            pieSort={d => d.pos}
            outerRadius={radius - 10}
            innerRadius={radius - 20}
            fill={'green'}
            fillOpacity={d => (d.data.pos ? 0.1 : 0.7)}
            padAngle={0}
          />
        </Group>
        <text
          x={radius}
          y={radius}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}
        >
          {~~(significant * 100 / total)}%
        </text>
      </svg>
    </React.Fragment>
  );
}

export function SignificantEssentialitiesSummary(props) {
  const { width, height, essentialities, scoreRange } = props;

  const significantEssentialities = essentialities.filter(
    essentiality => essentiality.attributes.fc_corrected < 0
  );

  const margin = {
    top: 1,
    left: 1,
    right: 1,
    bottom: 1
  };

  const significant = significantEssentialities.length;
  const total = essentialities.length;

  const inScore = scoreRange
    ? significantEssentialities.filter(
        essentiality =>
          essentiality.attributes.fc_corrected >= scoreRange[0] &&
          essentiality.attributes.fc_corrected <= scoreRange[1]
      ).length
    : significant;

  if (!total) {
    return <div />;
  }
  const radius = Math.min(width, height) / 2;
  return (
    <React.Fragment>
      <div>
        Essential in <b>{inScore}</b> cell lines
      </div>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              { pos: 0, opacity: 0.7, number: inScore },
              { pos: 1, opacity: 0.1, number: total - significant },
              { pos: 2, opacity: 0.3, number: significant - inScore }
            ]}
            pieValue={d => d.number}
            pieSort={d => d.pos}
            outerRadius={radius - 10}
            innerRadius={radius - 20}
            fill={'green'}
            fillOpacity={d => d.data.opacity}
            padAngle={0}
          />
        </Group>
        <text
          x={radius}
          y={radius}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}
        >
          {~~(inScore * 100 / total)}%
        </text>
      </svg>
    </React.Fragment>
  );
}
