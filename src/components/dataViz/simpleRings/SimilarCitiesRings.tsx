import React, {useRef, useEffect, useState} from 'react';
import {useWindowWidth} from '../../../contextProviders/appContext';
import styled, {keyframes} from 'styled-components/macro';
import Chart from './Chart';
import useProximityData from '../similarCitiesMap/useProximityData';
import useCurrentCityId from '../../../hooks/useCurrentCityId';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(1.2);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;
const Root = styled.div`
  width: 100%;
  height: 100%;
`;

const RingsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.2);
  opacity: 0;
  animation: ${fadeIn} 0.2s ease-in-out 1 forwards;
`;

const SimpleRings = () => {
  const windowDimensions = useWindowWidth();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{width: number, height: number} | undefined>(undefined);
  const cityId = useCurrentCityId();
  const chartKey = dimensions
    ? cityId + 'industry-space-sized-to-container-key' + dimensions.width.toString() + dimensions.height.toString()
    : cityId + 'industry-space-sized-to-container-key-0-0';

  const {loading, data} = useProximityData();

  useEffect(() => {
    const node = rootRef.current;
    if (node) {
      setTimeout(() => {
        const {width, height} = node.getBoundingClientRect();
        setDimensions({width, height});
      }, 0);
    }
  }, [rootRef, windowDimensions]);

  return (
    <Root ref={rootRef} key={chartKey}>
      <RingsContainer>
        <Chart
          width={dimensions ? dimensions.width : 0}
          height={dimensions ? dimensions.height : 0}
          loading={loading}
          data={data}
        />
      </RingsContainer>
    </Root>
  );
};

export default SimpleRings;