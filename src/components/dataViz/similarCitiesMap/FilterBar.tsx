import React, {useState} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import {
  primaryColor,
  primaryHoverColor,
  ButtonBase,
  backgroundDark,
  backgroundMedium,
  baseColor,
  primaryFont,
  lightBaseColor,
} from '../../../styling/styleUtils';
import useFluent from '../../../hooks/useFluent';
import ReactSlider from 'react-slider';
import MultiSelect from '@khanacademy/react-multi-select';
import {formatNumber} from '../../../Utils';
import {useMapContext} from 'react-city-space-mapbox';
import raw from 'raw.macro';
const ChevronSVG = raw('../../../assets/icons/chevron.svg');

export const filterBarId = 'similar-cities-filter-bar-id';

const Root = styled.div`
  background-color: rgba(255, 255, 255, 0.85);
`;

const Title = styled.h3`
  color: ${primaryColor};
  text-transform: uppercase;
  margin: 0;
  padding: 0.2rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const TitleText = styled.span`
  margin-right: 0.5rem;
`;

const Arrow = styled.span`
  width: 0.7rem;
  height: 1rem;
  display: inline-block;

  svg {
    width: 100%;
    height: 100%;

    polyline {
      stroke: ${primaryColor};
    }
  }
`;

const Settings = styled.div`
  padding: 0.35rem 0.75rem 1rem;
  display: flex;
`;

const ExpandBox = styled.div`
  flex-grow: 1;
  padding-right: 1rem;
`;

const ShrinkBox = styled.div`
  flex-shrink: 1;
  margin-top: 1.6rem;
`;

const UpdateButton = styled(ButtonBase)`
  background-color: ${primaryColor};
  color: #fff;

  &:hover {
    background-color: ${primaryHoverColor};
  }
`;


const slideRootClassName = 'react-slider-root-class';
const slideThumbClassName = 'react-slider-thumb-class';
const slideTrackClassName = 'react-slider-track-class';

const SliderContainer = styled.div`
  margin-top: 1.5rem;

  .${slideThumbClassName} {
    background-color: ${primaryColor};
    height: 1rem;
    width: 1rem;
    border-radius: 1000px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;

    span {
      color: ${primaryColor};
      transform: translateY(-100%);
    }
  }
  .${slideThumbClassName}-0 {
    transform: translateX(-0.1rem);
  }
  .${slideTrackClassName} {
    margin-top: 0.25rem;
  }
  .${slideTrackClassName}-0 {
    background-color: ${backgroundMedium};
    height: 0.5rem;
  }
  .${slideTrackClassName}-1 {
    background-color: ${backgroundDark};
    height: 0.5rem;
  }
  .${slideTrackClassName}-2 {
    background-color: ${backgroundMedium};
    height: 0.5rem;
  }
`;

const SelectBoxContainer = styled.div`
  margin-top: 0.3rem;
  position: relative;
  z-index: 10;

  .multi-select {
    .dropdown {
      .dropdown-heading {
        border-radius: 0 !important;
        border-color: ${backgroundDark} !important;
        color: ${baseColor} !important;
        ::placeholder, span {
          color: ${baseColor} !important;
          opacity: 1;
        }
        .dropdown-heading-dropdown-arrow span {
          border-color: ${baseColor} transparent transparent !important;
        }
      }
      .dropdown-content {
        font-family: ${primaryFont} !important;
        border-color: ${lightBaseColor} !important;
        input {
          border-radius: 0 !important;
          border-color: ${lightBaseColor} !important;
          font-family: ${primaryFont} !important;
        }
        .select-item {
          color: ${baseColor} !important;

          &:hover {
            background-color: ${backgroundMedium} !important;
          }
        }
      }
    }
    .dropdown[aria-expanded="true"] {
      .dropdown-heading {
        .dropdown-heading-dropdown-arrow span {
          border-color: transparent transparent ${baseColor} !important;
        }
      }
    }
  }
`;

function selectBoxValueRenderer(selected: any, allOptions: any) {
  if (selected.length === 0 || selected.length === allOptions.length) {
    return 'All Regions';
  }

  return selected.length === 1 ? selected.label : `${selected.length} Regions Selected`;
}

interface FilterValues {
  selectedRegionIds:  string[];
  minMaxPopulation: [number, number];
  minMaxGdpPppPc: [number, number];
}

interface Props {
  node: HTMLDivElement | null;
  populationRange: [number, number];
  gdpPppPcRange: [number, number];
  regions: {label: string, value: string}[];
  setFilterValues: (value: FilterValues) => void;
}

const FilterBar = (props: Props) => {
  const {populationRange, gdpPppPcRange, regions, setFilterValues} = props;
  const mapContext = useMapContext();
  const getString = useFluent();
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
  const [minMaxPopulation, setMinMaxPopulation] = useState<[number, number]>(populationRange);
  const [minMaxGdpPppPc, setMinMaxGdpPppPc] = useState<[number, number]>(gdpPppPcRange);

  const onUpdateClick = () => {
    if (mapContext.intialized) {
      mapContext.setFilterParamaters(minMaxPopulation, minMaxGdpPppPc, selectedRegionIds);
      setFilterValues({minMaxPopulation, minMaxGdpPppPc, selectedRegionIds});
    }
  };

  const node = props.node ? props.node : document.getElementById(filterBarId) as HTMLDivElement | null;
  if (node) {
    return createPortal((
      <Root>
        <Title
          onClick={() => setSettingsOpen(curr => !curr)}
        >
          <TitleText>{getString(settingsOpen ? 'city-filter-title-close' : 'city-filter-title-open')}</TitleText>
          <Arrow
            style={{transform: settingsOpen ? 'rotate(180deg)' : undefined}}
            dangerouslySetInnerHTML={{__html: ChevronSVG}}
          />
        </Title>
        <Settings style={{display: settingsOpen ? undefined : 'none'}}>
          <ExpandBox>
            {getString('global-text-population')}
            <SliderContainer>
              <ReactSlider
                className={slideRootClassName}
                thumbClassName={slideThumbClassName}
                trackClassName={slideTrackClassName}
                defaultValue={populationRange}
                renderThumb={(p, state) => <small {...p}><span>{formatNumber(state.valueNow, 0)}</span></small>}
                pearling
                max={populationRange[1]}
                min={populationRange[0]}
                //minDistance={5000000}
                onAfterChange={v => setMinMaxPopulation(v as [number, number])}
              />
            </SliderContainer>
          </ExpandBox>
          <ExpandBox>
            {getString('global-text-gdp-per-capita')}
            <SliderContainer>
              <ReactSlider
                className={slideRootClassName}
                thumbClassName={slideThumbClassName}
                trackClassName={slideTrackClassName}
                defaultValue={gdpPppPcRange}
                renderThumb={(p, state) => <small {...p}><span>${formatNumber(state.valueNow, 0)}</span></small>}
                pearling
                max={gdpPppPcRange[1]}
                min={gdpPppPcRange[0]}
                //minDistance={15000}
                onAfterChange={v => setMinMaxGdpPppPc(v as [number, number])}
              />
            </SliderContainer>
          </ExpandBox>
          <ExpandBox>
            {getString('city-filter-regions')}
            <SelectBoxContainer>
              <MultiSelect
                options={regions}
                selected={selectedRegionIds}
                onSelectedChanged={(s: string[]) => setSelectedRegionIds(s)}
                valueRenderer={selectBoxValueRenderer}
                hasSelectAll={false}
                disableSearch={true}
              />
            </SelectBoxContainer>
          </ExpandBox>
          <ShrinkBox>
            <UpdateButton onClick={onUpdateClick}>
              {getString('city-filter-update')}
            </UpdateButton>
          </ShrinkBox>
        </Settings>
      </Root>
    ), node);
  }

  return null;
};

export default FilterBar;
