import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import React from 'react';

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

  if (!total) {
    return <div />;
  }

  const radius = Math.min(width, height) / 2;
  const cellLinesSuffix = significant === 1 ? '' : 's';
  return (
    <React.Fragment>
      <div>
        <b>{significant}</b> loss of fitness gene{cellLinesSuffix}
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
