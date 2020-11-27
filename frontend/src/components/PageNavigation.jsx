import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const PageNavigation = (props) => {
  const {
    totalPages,
    currentPageNo,
    showPrevLink,
    showNextLink,
    handlePrevClick,
    handleNextClick
  } = props;
  return (
    <div>
      {totalPages !== 0 && (
        <span>
          <ButtonGroup
            variant="text"
            color="secondary"
            aria-label="text secondary button group"
          >
            <Button disabled={!showPrevLink} onClick={handlePrevClick}>
              이전
            </Button>
            <Button disabled color="primary">
              {currentPageNo}
            </Button>
            <Button disabled={!showNextLink} onClick={handleNextClick}>
              다음
            </Button>
          </ButtonGroup>
        </span>
      )}
    </div>
  );
};

export default PageNavigation;
