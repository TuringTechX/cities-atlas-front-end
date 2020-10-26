import React, {useState, useRef} from 'react';
import BasicModal from '../../../../../components/standardModal/BasicModal';
import UtiltyBar, {ModalType} from '../../../../../components/navigation/secondaryHeader/UtilityBar';
import CompositionTreeMap from '../../../../../components/dataViz/treeMap/CompositionTreeMap';
import {defaultYear} from '../../../../../Utils';
import {
  ContentGrid,
} from '../../../../../styling/styleUtils';
import {
  ClassificationNaicsIndustry,
  CompositionType,
  defaultDigitLevel,
  defaultCompositionType,
} from '../../../../../types/graphQL/graphQLTypes';
import CategoryLabels from '../../../../../components/dataViz/legend/CategoryLabels';
import StandardSideTextBlock from '../../../../../components/general/StandardSideTextBlock';
import styled from 'styled-components/macro';
import useGlobalLocationData from '../../../../../hooks/useGlobalLocationData';
import useSectorMap from '../../../../../hooks/useSectorMap';
import DownloadImageOverlay from './DownloadImageOverlay';
import noop from 'lodash/noop';
import useQueryParams from '../../../../../hooks/useQueryParams';

const TreeMapRoot = styled.div`
  display: contents;
`;

interface Props {
  cityId: string;
}

const EconomicComposition = (props: Props) => {
  const { cityId } = props;
  const [highlighted, setHighlighted] = useState<string | undefined>(undefined);
  const [hiddenSectors, setHiddenSectors] = useState<ClassificationNaicsIndustry['id'][]>([]);
  const {digit_level, composition_type} = useQueryParams();
  const sectorMap = useSectorMap();
  const toggleSector = (sectorId: ClassificationNaicsIndustry['id']) =>
    hiddenSectors.includes(sectorId)
      ? setHiddenSectors(hiddenSectors.filter(sId => sId !== sectorId))
      : setHiddenSectors([...hiddenSectors, sectorId]);
  const isolateSector = (sectorId: ClassificationNaicsIndustry['id']) =>
    hiddenSectors.length === sectorMap.length - 1 && !hiddenSectors.find(sId => sId === sectorId)
      ? setHiddenSectors([])
      : setHiddenSectors([...sectorMap.map(s => s.id).filter(sId => sId !== sectorId)]);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const closeModal = () => setModalOpen(null);
  const treeMapRef = useRef<HTMLDivElement | null>(null);
  const globalLocationData = useGlobalLocationData();

  let modal: React.ReactElement<any> | null;
  if (modalOpen === ModalType.DownloadImage && treeMapRef.current) {
    const cellsNode = treeMapRef.current.querySelector('div.react-canvas-tree-map-masterContainer');
    if (cellsNode) {
      const targetCity = globalLocationData.data && globalLocationData.data.cities.find(c => c.cityId === cityId);
      modal = (
        <DownloadImageOverlay
          onClose={closeModal}
          cityId={parseInt(cityId, 10)}
          cityName={targetCity && targetCity.name ? targetCity.name : undefined}
          year={defaultYear}
          digitLevel={digit_level ? parseInt(digit_level, 10) : defaultDigitLevel}
          compositionType={composition_type ? composition_type as CompositionType : defaultCompositionType}
          hiddenSectors={hiddenSectors}
          treeMapCellsNode={cellsNode as HTMLDivElement}
        />
      );
    } else {
      modal = null;
      setModalOpen(null);
    }
  } else if (modalOpen === ModalType.Data) {
    modal = (
      <BasicModal onClose={closeModal} width={'auto'} height={'auto'}>
        <h1>Display data disclaimer</h1>
      </BasicModal>
    );
  } else if (modalOpen === ModalType.DownloadData) {
    modal = (
      <BasicModal onClose={closeModal} width={'auto'} height={'auto'}>
        <h1>DownloadData</h1>
      </BasicModal>
    );
  } else if (modalOpen === ModalType.HowToRead) {
    modal = (
      <BasicModal onClose={closeModal} width={'auto'} height={'auto'}>
        <h1>Read this Chart</h1>
      </BasicModal>
    );
  } else {
    modal = null;
  }

  return (
    <>
      <ContentGrid>
        <StandardSideTextBlock>
          <h2>Employment &amp; Industry Composition</h2>

          {/* eslint-disable-next-line */}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        </StandardSideTextBlock>
        <TreeMapRoot ref={treeMapRef}>
          <CompositionTreeMap
            cityId={parseInt(cityId, 10)}
            year={defaultYear}
            digitLevel={digit_level ? parseInt(digit_level, 10) : defaultDigitLevel}
            compositionType={composition_type ? composition_type as CompositionType : defaultCompositionType}
            highlighted={highlighted}
            hiddenSectors={hiddenSectors}
            openHowToReadModal={() => setModalOpen(ModalType.HowToRead)}
            setHighlighted={setHighlighted}
          />
        </TreeMapRoot>
        <CategoryLabels
          categories={sectorMap}
          toggleCategory={toggleSector}
          isolateCategory={isolateSector}
          hiddenCategories={hiddenSectors}
        />
        {modal}
      </ContentGrid>
      <UtiltyBar
        onDownloadImageButtonClick={
          cityId !== null && treeMapRef.current ? () => setModalOpen(ModalType.DownloadImage) : noop
        }
        onDataButtonClick={() => setModalOpen(ModalType.Data)}
        onDownloadDataButtonClick={() => setModalOpen(ModalType.DownloadData)}
      />
    </>
  );
};

export default EconomicComposition;