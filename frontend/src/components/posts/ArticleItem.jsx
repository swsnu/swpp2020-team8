import React from 'react';
import styled from 'styled-components';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';

const ArticleItemWrapper = styled.div`
  background: #fff;
  padding: 16px;
  font-size: 14px;
  border: 1px solid #eee;
  margin: 8px 12px;
`;

const ContentWrapper = styled.div`
  margin: 12px 0 8px;
`;

export default function ArticleItem({ articleObj }) {
  // TODO: fix isAuthor
  const isAuthor = true;
  return (
    <ArticleItemWrapper>
      <AuthorProfile author={articleObj.author_detail} />
      {isAuthor && <PostAuthorButtons />}
      <ContentWrapper>{articleObj.content}</ContentWrapper>
      <CreateTime createdTime={articleObj.created_at} />
    </ArticleItemWrapper>
  );
}
