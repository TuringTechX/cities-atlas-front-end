import React, {useState} from 'react';
import UtiltyBar from '../../../../../components/navigation/secondaryHeader/UtilityBar';
import ClusteredIndustrySpace from '../../../../../components/dataViz/industrySpace';
import {ZoomLevel} from '../../../../../components/dataViz/industrySpace/chart/createChart';
import {defaultYear} from '../../../../../Utils';
import {
  ContentGrid,
  ContentParagraph,
  ContentTitle,
} from '../../../../../styling/styleUtils';
import {
  defaultCompositionType,
} from '../../../../../types/graphQL/graphQLTypes';
import CategoryLabels from '../../../../../components/dataViz/legend/CategoryLabels';
import IntensityLegend from '../../../../../components/dataViz/legend/IntensityLegend';
import StandardSideTextBlock from '../../../../../components/general/StandardSideTextBlock';
import useSectorMap from '../../../../../hooks/useSectorMap';
import useQueryParams from '../../../../../hooks/useQueryParams';
import {Toggle} from '../../../../../routing/routes';
import IndustryDistanceTable from './IndustryDistanceTable';
import styled from 'styled-components/macro';
import NodeLegendSrc from './node-legend.svg';

const NodeLegend = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0.875rem;
  position: absolute;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
  border-top: none;

  img {
    width: 100%;
    max-width: 200px;
    max-height: 100%;
  }

  @media (max-height: 875px) {
    position: sticky;
  }
`;

interface Props {
  cityId: string;
}

const EconomicComposition = (props: Props) => {
  const { cityId } = props;
  const [highlighted, setHighlighted] = useState<string | undefined>(undefined);
  const [hovered, setHovered] = useState<string | undefined>(undefined);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(ZoomLevel.Cluster);
  const sectorMap = useSectorMap();
  const {hide_clusters} = useQueryParams();
  const hideClusterOverlay= hide_clusters === Toggle.Off;
  const legend = zoomLevel === ZoomLevel.Node || hideClusterOverlay ? (
    <CategoryLabels
      categories={sectorMap}
      allowToggle={false}
      fullWidth={true}
    />
  ) : <IntensityLegend />;

  const nodeLegend = zoomLevel === ZoomLevel.Node || hideClusterOverlay ? (
    <NodeLegend>
      <img
        src={NodeLegendSrc}
        alt={'Colored Nodes mean High Intensity Employment, Gray Nodes mean Low Intensity Employment'}
      />
    </NodeLegend>
  ) : null;

  const sideContent = highlighted === undefined ? (
    <StandardSideTextBlock>
      <ContentTitle>What is my city's position in the Industry Space?</ContentTitle>
      {/* eslint-disable-next-line */}
      <ContentParagraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</ContentParagraph>
        {nodeLegend}
    </StandardSideTextBlock>
  ) : (
    <StandardSideTextBlock clearStyles={true}>
      <IndustryDistanceTable
        id={highlighted}
        hovered={hovered}
        setHovered={setHovered}
        setHighlighted={setHighlighted}
      />
    </StandardSideTextBlock>
  );
  return (
    <>
      <ContentGrid>
        {sideContent}
        <ClusteredIndustrySpace
          cityId={parseInt(cityId, 10)}
          year={defaultYear}
          compositionType={defaultCompositionType}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          setZoomLevel={setZoomLevel}
          hideClusterOverlay={hideClusterOverlay}
          setHovered={setHovered}
          hovered={hovered}
        />
        {legend}
      </ContentGrid>
      <UtiltyBar
      />
    </>
  );
};

export default EconomicComposition;