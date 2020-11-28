/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
// import LinearProgress from '@material-ui/core/LinearProgress';
import FriendItem from '../components/friends/FriendItem';
import PageNavigation from '../components/PageNavigation';
import { fetchSearchResults } from '../modules/search';

const FriendListWrapper = styled.div`
  padding: 16px;
  border: 1px solid whitesmoke;
  padding-top: 0;
  border-radius: 4px;
  background: whitesmoke;
  margin-top: 16px;
  margin-bottom: 16px;
`;

FriendListWrapper.displayName = 'FriendListWrapper';

export default function SearchResults() {
  const dispatch = useDispatch();
  const searchObj = useSelector((state) => state.searchReducer.searchObj);

  const showPrevLink = searchObj.currentPageNo > 1;
  const showNextLink = searchObj.totalPages > searchObj.currentPageNo;

  const handlePageClick = (type, event) => {
    event.preventDefault();
    const updatePageNo =
      type === 'prev'
        ? searchObj.currentPageNo - 1
        : searchObj.currentPageNo + 1;

    if (!searchObj.loading) {
      dispatch(fetchSearchResults(updatePageNo, searchObj.query));
    }
  };

  const renderSearchResults = () => {
    const userItemList = searchObj.results?.map((user) => {
      return <FriendItem key={user.id} friendObj={user} />;
    });

    if (Object.keys(searchObj.results).length && searchObj.results.length) {
      return (
        <span>
          {searchObj.searchError ? (
            searchObj.message && <p className="message">{searchObj.message}</p>
          ) : (
            <FriendListWrapper>
              <h3>
                친구 목록
                {`(${searchObj.numResults})`}
              </h3>
              {/* {searchObj.loading && searchObj.numResults > 0 ? ( */}
              {/*  <LinearProgress /> */}
              {/* ) : ( */}
              {/*  <span /> */}
              {/* )} */}
              {userItemList}
            </FriendListWrapper>
          )}
        </span>
      );
    }
    return <h2>검색 결과 없음</h2>;
  };

  return (
    <span>
      {renderSearchResults()}

      <PageNavigation
        totalPages={searchObj.totalPages}
        currentPageNo={searchObj.currentPageNo}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={(event) => handlePageClick('prev', event)}
        handleNextClick={(event) => handlePageClick('next', event)}
      />
    </span>
  );
}
