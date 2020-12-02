import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import useOnClickOutside from 'use-onclickoutside';
import { fetchSearchResults } from '../modules/search';
import SearchDropdownList from '../components/SearchDropdownList';

const SearchTitle = styled.div`
  margin: 16px 0;
  font-size: 20px;
`;
const SearchTextField = styled(TextField)`
  width: 100%;
`;
export default function MobileSearchPage() {
  const searchRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();

  const [query, setQuery] = useState('');

  const totalPages = useSelector(
    (state) => state.searchReducer.searchObj?.totalPages
  );

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  useOnClickOutside(searchRef, handleSearchClose);

  useEffect(() => {
    if (query.length) {
      dispatch(fetchSearchResults(1, query));
      setIsSearchOpen(true);
    } else setIsSearchOpen(false);
  }, [query]);

  useEffect(() => {
    if (totalPages > 0) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [totalPages]);

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const onKeySubmit = (e) => {
    if (e.key === 'Enter' && query !== '') {
      setIsSearchOpen(false);
      history.push(`/search`);
    }
  };

  return (
    <div>
      <SearchTitle>사용자 검색</SearchTitle>
      <SearchTextField
        required
        id="input-search-field"
        value={query}
        label="검색어(닉네임)를 입력하세요."
        type="search"
        variant="outlined"
        placeholder={query}
        onChange={handleChange}
        onKeyDown={onKeySubmit}
        InputProps={{
          autoComplete: 'off',
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                id="search-icon"
                aria-label="toggle search"
                onClick={() => history.push('/search')}
                edge="end"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <div ref={searchRef}>{isSearchOpen && <SearchDropdownList />}</div>
    </div>
  );
}
