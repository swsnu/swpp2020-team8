import React, { useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AuthorProfile from './AuthorProfile';
import CreateTime from './CreateTime';
import PostAuthorButtons from './PostAuthorButtons';
import QuestionBox from './QuestionBox';

const PostItemWrapper = styled.div`
  background: #fff;
  padding: 16px;
  font-size: 14px;
  border: 1px solid #eee;
  margin: 8px 0;
  position: relative;
  border-radius: 4px;
`;

PostItemWrapper.displayName = 'PostItemWrapper';

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

export default function PostItem({ articleObj }) {
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
    <PostItemWrapper>
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
        {isAuthor && (
          <div id="like-count" style={{ margin: '4px' }}>
            {likeCount}
          </div>
        )}
      </FooterWrapper>
    </PostItemWrapper>
  );
}
