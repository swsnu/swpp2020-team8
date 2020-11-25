/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';

import FriendItem from './friends/FriendItem';
import PageNavigation from './PageNavigation';
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
  const [query, setQuery] = useState('');

  const results = useSelector((state) => state.searchReducer.results);
  const loading = useSelector((state) => state.searchReducer.loading);
  const message = useSelector((state) => state.searchReducer.message);
  const totalPages = useSelector((state) => state.searchReducer.totalPages);
  const currentPageNo = useSelector(
    (state) => state.searchReducer.currentPageNo
  );
  const numResults = useSelector((state) => state.searchReducer.numResults);

  const showPrevLink = currentPageNo > 1;
  const showNextLink = totalPages > currentPageNo;

  const handlePageClick = (type, event) => {
    event.preventDefault();
    const updatePageNo =
      type === 'prev' ? currentPageNo - 1 : currentPageNo + 1;

    if (!loading) {
      dispatch(fetchSearchResults(updatePageNo, query));
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;

    setQuery(value);

    dispatch(fetchSearchResults(1, value));
  };

  const renderSearchResults = () => {
    const userItemList = results?.map((user) => {
      return <FriendItem key={user.id} friendObj={user} />;
    });

    if (Object.keys(results).length && results.length) {
      return (
        <FriendListWrapper>
          <h3>
            친구 목록
            {`(${numResults})`}
          </h3>
          {userItemList}
        </FriendListWrapper>
      );
    }
    return <span />;
  };

  return (
    <div className="container">
      <TextField
        id="outlined-search"
        value={query}
        label="사용자 검색"
        type="search"
        variant="outlined"
        onChange={handleChange}
      />

      {message && <p className="message">{message}</p>}

      <PageNavigation
        numResults={numResults}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={(event) => handlePageClick('prev', event)}
        handleNextClick={(event) => handlePageClick('next', event)}
      />

      {loading && numResults > 0 ? <CircularProgress /> : <span />}

      {renderSearchResults()}

      <PageNavigation
        numResults={numResults}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={(event) => handlePageClick('prev', event)}
        handleNextClick={(event) => handlePageClick('next', event)}
      />
    </div>
  );
}
