import React from 'react';
import Button from '@material-ui/core/Button';

const PageNavigation = (props) => {
  const {
    numResults,
    showPrevLink,
    showNextLink,
    handlePrevClick,
    handleNextClick
  } = props;
  return (
    <div className="nav-link-container">
      {numResults === 0 ? (
        <span />
      ) : (
        <span>
          {showPrevLink ? (
            <Button variant="contained" onClick={handlePrevClick}>
              이전
            </Button>
          ) : (
            <Button variant="contained" disabled onClick={handlePrevClick}>
              이전
            </Button>
          )}
          <span> </span>
          {showNextLink ? (
            <Button variant="contained" onClick={handleNextClick}>
              다음
            </Button>
          ) : (
            <Button variant="contained" disabled onClick={handleNextClick}>
              다음
            </Button>
          )}
        </span>
      )}
    </div>
  );
};

export default PageNavigation;
