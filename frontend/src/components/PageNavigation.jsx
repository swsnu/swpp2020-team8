import React from 'react';

const PageNavigation = (props) => {
  const {
    loading,
    showPrevLink,
    showNextLink,
    handlePrevClick,
    handleNextClick
  } = props;
  return (
    <div className="nav-link-container">
      <button
        type="button"
        className={`nav-link 
					${showPrevLink ? 'show' : 'hide'}
					${loading ? 'greyed-out' : ''}`}
        onClick={handlePrevClick}
      >
        Prev
      </button>
      <button
        type="button"
        className={`nav-link 
					${showNextLink ? 'show' : 'hide'}
					${loading ? 'greyed-out' : ''}
					`}
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  );
};

export default PageNavigation;
