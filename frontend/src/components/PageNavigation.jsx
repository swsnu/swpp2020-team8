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
        <div style={{ textAlign: 'center' }}>
          <ButtonGroup
            variant="text"
            color="secondary"
            aria-label="text secondary button group"
          >
            <Button
              className="prev-button"
              disabled={!showPrevLink}
              onClick={handlePrevClick}
            >
              이전
            </Button>
            <Button disabled color="primary">
              {currentPageNo}
            </Button>
            <Button
              className="next-button"
              disabled={!showNextLink}
              onClick={handleNextClick}
            >
              다음
            </Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
};

export default PageNavigation;
