import React from 'react';
import styled, {keyframes} from 'styled-components/macro';
import Label, {CategoryDatum} from './Label';
import {breakPoints} from '../../../styling/GlobalGrid';
import {
  backgroundMedium,
  baseColor,
} from '../../../styling/styleUtils';
import raw from 'raw.macro';

const ReloadImgSrc = raw('../../../assets/icons/reload.svg');

const RootBase = styled.div`
  grid-row: 3;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  @media ${breakPoints.small} {
    grid-row: 4;
  }
`;

const StandardRoot = styled(RootBase)`
  grid-column: 1;
  justify-content: center;
`;

const FullWidthRoot = styled(RootBase)`
  grid-column: 1 / -1;
`;

const StandardContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem 0 0;
  margin-bottom: 1rem;

  @media ${breakPoints.small} {
    margin-bottom: 3rem;
  }
`;

const FullWidthContent = styled(StandardContent)`
  padding: 1rem 1rem 1rem 0;

  @media ${breakPoints.small} {
    padding-right: 0;
  }
`;

const fadeAndSlideIn = keyframes`
  from {
    transform: translate(0, 0);
    opacity: 0;
  }

  to {
    transform: translate(0, calc(50% + 0.25rem));
    opacity: 1;
  }
`;

const ResetLabelsButtonContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  pointer-events: none;
`;

const ResetLabelsButton = styled.button`
  pointer-events: all;
  animation: ${fadeAndSlideIn} 0.2s linear 1 forwards;
  text-transform: uppercase;
  color: ${baseColor};
  background-color: ${backgroundMedium};
  font-size: 0.65rem;
  font-weight: 600;
  outline-color: ${backgroundMedium};
  transition: outline 0.1s linear;
  padding: 0.3rem 0.5rem;
  display: inline-flex;
  align-items: center;

  &:hover, &:focus {
    outline: solid 2px ${backgroundMedium};
  }
`;

const ReloadIcon = styled.div`
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.5rem;

  svg {
    width: 100%;
    height: 100%;

    path {
      fill: ${baseColor};
    }
  }
`;

interface BaseProps {
  categories: CategoryDatum[];
  fullWidth?: boolean;
}

type Props = BaseProps & (
  {
    allowToggle: true;
    toggleCategory: (id: string) => void;
    isolateCategory: (id: string) => void;
    hiddenCategories: string[];
    resetCategories: () => void;
    resetText: string;
  } | {
    allowToggle: false;
  }
);

const CategoryLabels = (props: Props) => {
  const {categories, fullWidth} = props;
  let output: React.ReactElement<any>;
  if (props.allowToggle) {
    const {
      toggleCategory, isolateCategory, hiddenCategories,
      resetCategories, resetText,
    } = props;

    const labels = categories.map(category => {
      const isHidden = !!hiddenCategories.find(id => id === category.id);
      const isIsolated = hiddenCategories.length === categories.length - 1 && !isHidden;
      return (
        <Label
          key={'sector-label-' + category.id}
          category={category}
          toggleCategory={() => toggleCategory(category.id)}
          isolateCategory={() => isolateCategory(category.id)}
          isHidden={isHidden}
          isIsolated={isIsolated}
        />
      );
    });

    const resetButton = hiddenCategories.length ? (
      <ResetLabelsButtonContainer>
        <ResetLabelsButton onClick={resetCategories}>
          <ReloadIcon dangerouslySetInnerHTML={{__html: ReloadImgSrc}} /> {resetText}
        </ResetLabelsButton>
      </ResetLabelsButtonContainer>
    ) : null;

    output = (
      <>
        {labels}
        {resetButton}
      </>
    );
  } else {
    const labels = categories.map(category => (
      <Label
        key={'sector-label-' + category.id}
        category={category}
        isHidden={false}
        isIsolated={false}
      />
    ));

    output = (
      <>
        {labels}
      </>
    );
  }

  const Root = fullWidth ? FullWidthRoot : StandardRoot;
  const Content = fullWidth ? FullWidthContent : StandardContent;

  return (
    <Root>
      <Content>
        {output}
      </Content>
    </Root>
  );
};

export default CategoryLabels;
