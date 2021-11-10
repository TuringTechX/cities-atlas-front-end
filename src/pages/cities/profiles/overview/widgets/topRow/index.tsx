import React from 'react';
import { usePeerGroupCityCount } from '../../../../../../components/navigation/secondaryHeader/comparisons/AddComparisonModal';
import useCurrentCity from '../../../../../../hooks/useCurrentCity';
import useGlobalLocationData from '../../../../../../hooks/useGlobalLocationData';
import { TitleBase, YearText, Icon, ValueBase, ListItem, TitleSmall } from '../styleUtils';
import PopulationSVG from '../../../../../../assets/icons/population.svg';
import RankingSVG from '../../../../../../assets/icons/ranking.svg';
import GdpPerCapitaSVG from '../../../../../../assets/icons/gdppercapita.svg';
import DataReliabilitySVG from '../../../../../../assets/icons/datareliability.svg';
import { defaultYear, formatNumberLong, numberWithCommas } from '../../../../../../Utils';
import useFluent, { ordinalNumber } from '../../../../../../hooks/useFluent';
import { DataFlagType } from '../../../../../../types/graphQL/graphQLTypes';
import styled from 'styled-components';
import Tooltip from '../../../../../../components/general/Tooltip';

const DataLegend = styled.div`
  margin-right: 0.2rem;
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const SmallDot = styled.div`
  width: .5rem;
  height: .5rem;
  border-radius: 1000px;
  margin-right: 0.075rem;
`;

const LargeDot = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 1000px;
  margin-right: 0.075rem;
`;

const TopRow = () => {
  const {loading: cityLoading, city} = useCurrentCity();
  const { loading, error, data } = usePeerGroupCityCount(city && city.cityId ? city.cityId : null);
  const globalLocations = useGlobalLocationData();
  const getString = useFluent();

  if (loading || cityLoading || globalLocations.loading) {
    return null;
  } else if (error) {
    console.error(error);
    return null;
  } else if (globalLocations.error) {
    console.error(globalLocations.error);
    return null;
  } else if (data && city && globalLocations.data) {
    const regionName = globalLocations.data.regions.find(d => d.regionId === city.region + '');

    let flagColor: React.ReactElement<any> | null = null;
    let alertTitle: string = '';
    let description: string = '';
    const dataFlag = city.dataFlag;
    if (dataFlag === DataFlagType.GREEN) {
      flagColor = (
        <DataLegend>
          <SmallDot style={{ backgroundColor: '#B70808' }} />
          <SmallDot style={{ backgroundColor: '#9A561A' }} />
          <SmallDot style={{ backgroundColor: '#71670F' }} />
          <LargeDot style={{ backgroundColor: '#137737' }} />
        </DataLegend>
      );
      alertTitle = getString('data-disclaimer-green-title');
      description = getString('data-disclaimer-green-desc');
    } else if (dataFlag === DataFlagType.YELLOW) {
      flagColor = (
        <DataLegend>
          <SmallDot style={{ backgroundColor: '#B70808' }} />
          <SmallDot style={{ backgroundColor: '#9A561A' }} />
          <LargeDot style={{ backgroundColor: '#71670F' }} />
          <SmallDot style={{ backgroundColor: '#137737' }} />
        </DataLegend>
      );
      alertTitle = getString('data-disclaimer-yellow-title');
      description = getString('data-disclaimer-yellow-desc');
    } else if (dataFlag === DataFlagType.ORANGE) {
      flagColor = (
        <DataLegend>
          <SmallDot style={{ backgroundColor: '#B70808' }} />
          <LargeDot style={{ backgroundColor: '#9A561A' }} />
          <SmallDot style={{ backgroundColor: '#71670F' }} />
          <SmallDot style={{ backgroundColor: '#137737' }} />
        </DataLegend>
      );
      alertTitle = getString('data-disclaimer-orange-title');
      description = getString('data-disclaimer-orange-desc');
    } else if (dataFlag === DataFlagType.RED) {
      flagColor = (
        <DataLegend>
          <LargeDot style={{ backgroundColor: '#B70808' }} />
          <SmallDot style={{ backgroundColor: '#9A561A' }} />
          <SmallDot style={{ backgroundColor: '#71670F' }} />
          <SmallDot style={{ backgroundColor: '#137737' }} />
        </DataLegend>
      );
      alertTitle = getString('data-disclaimer-red-title');
      description = getString('data-disclaimer-red-desc');
    }
    return (
      <>
        <div>
          <TitleBase>
            <Icon src={PopulationSVG} />
            {getString('global-text-population')}
            <YearText>
              2015
            </YearText>
          </TitleBase>
          <ValueBase>
            {formatNumberLong(city.population ? city.population : 0)}
          </ValueBase>
        </div>
        <div>
          <TitleBase>
            <Icon src={GdpPerCapitaSVG} />
            {getString('global-text-gdp-per-capita')}
            <YearText>
              2015
              <Tooltip
                explanation={getString('global-text-gdp-per-capita-about')}
              />
            </YearText>
          </TitleBase>
          <ValueBase>
            ${numberWithCommas(city.gdppc ? Math.round(city.gdppc) : 0)}
          </ValueBase>
        </div>
        <div>
          <TitleSmall>
            <Icon src={RankingSVG} />
            <div dangerouslySetInnerHTML={{ __html: getString('city-overview-ranking-title', {
              'city-peer-group-counts-region': data.cityPeerGroupCounts.region,
              'region-name': regionName?.regionName,
            })}} />
            <YearText>
              {defaultYear}
            </YearText>
          </TitleSmall>
          <ValueBase>
            <ListItem>
              {getString('city-overview-ranking-pop', { value: ordinalNumber([city.regionPopRank ? city.regionPopRank : 0]).toUpperCase()})}
            </ListItem>
            <ListItem>
              {getString('city-overview-ranking-gdp', { value: ordinalNumber([city.regionGdppcRank ? city.regionGdppcRank : 0]).toUpperCase() })}
            </ListItem>
          </ValueBase>
        </div>
        <div>
          <TitleBase>
            <Icon src={DataReliabilitySVG} />
            {getString('city-overview-data-quality')}
            <YearText>
              {defaultYear}
              <Tooltip
                explanation={<div dangerouslySetInnerHTML={{ __html: description }} />}
              />
            </YearText>
          </TitleBase>
          <ValueBase>
            {flagColor}
            {alertTitle}
          </ValueBase>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default TopRow;