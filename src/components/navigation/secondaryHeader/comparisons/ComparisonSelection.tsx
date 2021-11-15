import React, {useState} from 'react';
import AddComparisonModal, {ComparisonType} from './AddComparisonModal';
import {RegionGroup} from '../../../dataViz/comparisonBarChart/cityIndustryComparisonQuery';
import queryString from 'query-string';
import {
  errorColor,
  baseColor,
  medGray,
} from '../../../../styling/styleUtils';
import styled from 'styled-components/macro';
import matchingKeywordFormatter from '../../../../styling/utils/panelSearchKeywordFormatter';
import PanelSearch, {Datum} from 'react-panel-search';
import useFluent from '../../../../hooks/useFluent';
import useCurrentCityId from '../../../../hooks/useCurrentCityId';
import {
  useHistory,
  matchPath,
} from 'react-router-dom';
import {
  CityRoutes,
  cityIdParam,
} from '../../../../routing/routes';
import {createRoute} from '../../../../routing/Utils';
import useQueryParams from '../../../../hooks/useQueryParams';
import {PeerGroup} from '../../../../types/graphQL/graphQLTypes';
import {TooltipTheme} from '../../../general/Tooltip';
import {joyrideClassNames} from '../../../navigation/secondaryHeader/guide/CitiesGuide';

const CompareDropdownRoot = styled.div`
  padding-left: 1rem;
  border-left: solid 1px #333;
`;

const ButtonBase = styled.button`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  text-transform: uppercase;
  position: relative;
`;

const AddComparisonButton = styled(ButtonBase)`
  font-size: 0.75rem;
  padding: 0.4rem 0.5rem 0.4rem 1.65rem;
  color: #fff;
  background-color: ${medGray};
  outline: none;

  &:before {
    font-size: 1.85rem;
    content: '+';
    left: 0.15rem;
    position: absolute;
  }

  &:hover, &:focus {
    background-color: ${baseColor};
  }

  &:active {
    color: #fff;
  }
`;

const RemoveComparisonButton = styled(ButtonBase)`
  color: ${errorColor};
  outline: 0 solid rgba(255, 255, 255, 0);
  font-size: 0.75rem;
  padding: 0 0.25rem;
  transition: outline 0.1s ease;

  &:before {
    font-size: 1rem;
    margin-right: 0.35rem;
    content: '✕';
    transform: translate(1%, 0);
  }

  &:hover, &:focus {
    background-color: #fff;
    outline: 0.25rem solid #fff;
  }

  &:active {
    color: ${errorColor};
  }

  @media (max-width: 1280px) {
    max-width: 90px;
  }
`;

interface Props {
  data: Datum[];
}

const ComparisonSelection = (props: Props) => {
  const {data} = props;
  const getString = useFluent();
  const cityId = useCurrentCityId();
  const history = useHistory();
  const { benchmark, ...otherParams } = useQueryParams();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  let compareDropdown: React.ReactElement<any>;
  if (benchmark === undefined) {
    compareDropdown = (
      <div>
        <AddComparisonButton
          onClick={() => setModalOpen(true)}
          className={joyrideClassNames.compareEconComp}
        >
          {getString('global-ui-add-comparison')}
        </AddComparisonButton>
      </div>
    );
  } else {
    const onSelectComparison = (d: Datum | null) => {
      if (d) {
        const query = queryString.stringify({...otherParams, benchmark: d.id});
        const newUrl = query ? history.location.pathname + '?' + query : history.location.pathname;
        history.push(newUrl);
      }
    };
    const removeComparison = () => {
      let path: string = history.location.pathname;
      const isIndustryComparison = matchPath<{[cityIdParam]: string}>(
        path, CityRoutes.CityEconomicCompositionIndustryCompare,
      );
      if (isIndustryComparison && isIndustryComparison.isExact && cityId !== null) {
        path = createRoute.city(CityRoutes.CityEconomicComposition, cityId);
      }
      const query = queryString.stringify({...otherParams});
      const newUrl = query ? path + '?' + query : path;
      history.push(newUrl);
    };
    const comparisonData: Datum[] = [
      // space before world to trick alphabetical sort
      {id: RegionGroup.World, title: ' ' + getString('global-text-world'), level: null, parent_id: null},
      {
        id: PeerGroup.GlobalPopulation,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.GlobalPopulation}),
        level: null,
        parent_id: null,
      },
      {
        id: PeerGroup.GlobalIncome,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.GlobalIncome}),
        level: null,
        parent_id: null,
      },
      {
        id: PeerGroup.GlobalEuclideanDistance,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.GlobalEuclideanDistance}),
        level: null,
        parent_id: null,
      },
      {
        id: PeerGroup.RegionalPopulation,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.RegionalPopulation}),
        level: null,
        parent_id: null,
      },
      {
        id: PeerGroup.RegionalIncome,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.RegionalIncome}),
        level: null,
        parent_id: null,
      },
      {
        id: PeerGroup.RegionalEuclideanDistance,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.RegionalEuclideanDistance}),
        level: null,
        parent_id: null,
      },
      {
        id: PeerGroup.Region,
        title: getString('global-formatted-peer-groups', {type: PeerGroup.Region}),
        level: null,
        parent_id: null,
      },
      ...data.filter(({id}) => id !== cityId),
    ];
    compareDropdown = (
      <>
        <CompareDropdownRoot>
          <PanelSearch
            data={comparisonData}
            topLevelTitle={getString('global-text-countries')}
            disallowSelectionLevels={['0']}
            defaultPlaceholderText={getString('global-ui-type-a-city-name')}
            showCount={true}
            resultsIdentation={1.75}
            neverEmpty={true}
            selectedValue={comparisonData.find(({id}) => id === benchmark)}
            onSelect={onSelectComparison}
            maxResults={500}
            matchingKeywordFormatter={matchingKeywordFormatter(TooltipTheme.Light)}
          />
        </CompareDropdownRoot>
        <div>
          <RemoveComparisonButton onClick={removeComparison}>
            {getString('global-ui-remove-comparison')}
          </RemoveComparisonButton>
        </div>
      </>
    );
  }

  const closeModal = () => {
    setModalOpen(false);
  };
  const compareModal = modalOpen ? (
    <AddComparisonModal
      closeModal={closeModal}
      data={data}
      comparisonType={ComparisonType.Absolute}
    />
  ) : null;

  return (
    <>
      {compareDropdown}
      {compareModal}
    </>
  );

};

export default ComparisonSelection;