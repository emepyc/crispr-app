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
  const typeSuffix = significant === 1 ? '' : 's';

  const radius = Math.min(width, height) / 2;
  return (
    <React.Fragment>
      <div>
        Loss of fitness in <b>{significant}</b> cancer type{typeSuffix}
      </div>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              { pos: 0, opacity: 0.1, number: significant },
              { pos: 1, opacity: 0.7, number: total - significant }
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
  const { width, height, essentialities } = props;

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

  console.log(`outer: ${total} -- inner: ${total - significant}`);

  if (!total) {
    return <div />;
  }
  const radius = Math.min(width, height) / 2;
  const cellLinesSuffix = significant === 1 ? '' : 's';
  return (
    <React.Fragment>
      <div>
        Loss of fitness in <b>{significant}</b> cell line{cellLinesSuffix}
      </div>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              { pos: 0, opacity: 0.7, number: significant },
              { pos: 1, opacity: 0.1, number: total - significant }
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
          {~~(significant * 100 / total)}%
        </text>
      </svg>
    </React.Fragment>
  );
}

export function IsPanCancerEssential(props) {
  const { gene } = props;

  if (!gene.data) {
    return <div />;
  }
  const isPanCancer = gene.data.attributes.core_fitness_pancan;
  const fontSize = isPanCancer ? '1.2rem' : '1rem';
  const color = isPanCancer ? 'white' : 'grey';
  const backgroundColor = isPanCancer ? '#5ba633' : 'white';
  const panCancerLabel = isPanCancer ? 'Yes' : 'No';
  const panCancerElement = isPanCancer ? (
    <b>{panCancerLabel}</b>
  ) : (
    panCancerLabel
  );
  return (
    <React.Fragment>
      <div>Pan-cancer core fitness</div>
      <div
        className="container d-flex"
        style={{
          width: '70px',
          height: '70px',
          border: '2px solid #5ba633',
          marginTop: '10px',
          borderRadius: '10px',
          color,
          backgroundColor
        }}
      >
        <div
          className="row align-self-center mx-auto"
          style={{
            fontSize
          }}
        >
          {panCancerElement}
        </div>
      </div>
    </React.Fragment>
  );
}
