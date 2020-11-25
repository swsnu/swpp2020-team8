/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// import React, { useEffect, useState } from 'react';
import React from 'react';
import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';
import Loader from '../loader.gif';

import FriendItem from '../components/friends/FriendItem';
import PageNavigation from '../components/PageNavigation';
import axios from '../apis';

const FriendListWrapper = styled.div`
  padding: 16px;
  border: 1px solid whitesmoke;
  padding-top: 0;
  border-radius: 4px;
  background: whitesmoke;
`;

FriendListWrapper.displayName = 'FriendListWrapper';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      loading: false,
      message: '',
      totalPages: 0,
      currentPageNo: 0
    };
  }

  handleOnInputChange = (event) => {
    const query = event.target.value;
    if (!query) {
      this.setState({
        query,
        results: [],
        message: '',
        totalPages: 0
      });
    } else {
      this.setState({ query, loading: true, message: '' }, () => {
        this.fetchSearchResults(1, query);
      });
    }
  };

  handlePageClick = (type, event) => {
    const { items } = this.state;
    event.preventDefault();
    const updatePageNo =
      type === 'prev' ? items.currentPageNo - 1 : items.currentPageNo + 1;

    if (!items.loading) {
      this.setState({ loading: true, message: '' }, () => {
        this.fetchSearchResults(updatePageNo, items.query);
      });
    }
  };

  getPageCount = (total, denominator) => {
    const divisible = total % denominator === 0;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  fetchSearchResults = (updatedPageNo = '', query) => {
    const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
    const searchUrl = `user/search/?query=${query}${pageNumber}`;

    axios
      .get(searchUrl, {})
      .then((res) => {
        const { total } = res.data;
        const totalPagesCount = this.getPageCount(total, 20);
        const resultNotFoundMsg = !res.data.hits.length
          ? '검색 결과는 이게 끝입니다..?'
          : '';
        this.setState({
          results: res.data.hits,
          message: resultNotFoundMsg,
          totalPages: totalPagesCount,
          currentPageNo: updatedPageNo,
          loading: false
        });
      })
      .catch((error) => {
        if (error) {
          this.setState({
            loading: false,
            message:
              '검색 결과를 가져오지 못했습니다. 인터넷 연결 상태를 확인하세요?'
          });
        }
      });
  };

  renderSearchResults = () => {
    const { results } = this.state;
    //
    // useEffect(() => {
    //   dispatch(fetchSearchResults());
    // }, [dispatch]);

    console.log(results);

    const userItemList = results?.map((user) => {
      console.log('user id');
      console.log(user.id);
      return <FriendItem key={user.id} friendObj={user} />;
    });

    if (Object.keys(results).length && results.length) {
      return (
        <FriendListWrapper>
          <h3>
            친구 목록
            {`(${results?.length})`}
          </h3>
          {userItemList}
        </FriendListWrapper>
      );
    }
    return <span />;
  };

  render() {
    const { query, loading, message, currentPageNo, totalPages } = this.state;

    const showPrevLink = currentPageNo > 1;
    const showNextLink = totalPages > currentPageNo;

    return (
      <div className="container">
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            name="query"
            value={query}
            id="search-input"
            placeholder="Search..."
            onChange={this.handleOnInputChange}
          />
          <i className="fa fa-search search-icon" aria-hidden="true" />
        </label>

        {message && <p className="message">{message}</p>}

        <img
          src={Loader}
          className={`search-loading ${loading ? 'show' : 'hide'}`}
          alt="loader"
        />

        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={(event) => this.handlePageClick('prev', event)}
          handleNextClick={(event) => this.handlePageClick('next', event)}
        />

        {this.renderSearchResults()}

        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={(event) => this.handlePageClick('prev', event)}
          handleNextClick={(event) => this.handlePageClick('next', event)}
        />
      </div>
    );
  }
}

export default Search;
