import React, { useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import QuestionBox from './QuestionBox';

const ArticleItemWrapper = styled.div`
  background: #fff;
  padding: 16px;
  font-size: 14px;
  border: 1px solid #eee;
  margin: 8px 12px;
  position: relative;
  border-radius: 4px;
`;

const ContentWrapper = styled.div`
  margin: 12px 0 8px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

export default function ArticleItem({ articleObj }) {
  // TODO: fix
  const isAuthor = true;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
  };
  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <ArticleItemWrapper>
      <HeaderWrapper>
        <AuthorProfile author={articleObj.author_detail} />
        {isAuthor && (
          <PostAuthorButtons
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
          />
        )}
      </HeaderWrapper>
      {articleObj.question_detail && (
        <QuestionBox questionObj={articleObj.question_detail} />
      )}
      <ContentWrapper>{articleObj.content}</ContentWrapper>
      <CreateTime createdTime={articleObj.created_at} />
      <FooterWrapper>
        {liked ? (
          <FavoriteIcon onClick={toggleLike} color="primary" />
        ) : (
          <FavoriteBorderIcon onClick={toggleLike} color="primary" />
        )}
        {isAuthor && <div style={{ margin: '4px' }}>{likeCount}</div>}
      </FooterWrapper>
    </ArticleItemWrapper>
  );
}
