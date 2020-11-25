import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { TextareaAutosize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getSelectedPost } from '../modules/post';
import { PostItemWrapper } from '../styles';
import QuestionBox from '../components/posts/QuestionBox';
import ShareSettings from '../components/posts/ShareSettings';

const useStyles = makeStyles({
  textarea: {
    padding: '5px',
    borderRadius: '2px',
    color: 'rgb(50, 50, 50)',
    fontSize: '14px',
    outline: 'none !important',
    width: '100%',
    height: 'auto',
    boxSizing: 'border-box',
    border: 'none',
    margin: '4px 0',
    background: '#fff',
    cursor: 'auto',
    resize: 'none',
    overflow: 'hidden'
  }
});

const PostEdit = () => {
  const { postType, id } = useParams();
  const dispatch = useDispatch();

  const selectedPost = useSelector((state) => state.postReducer.selectedPost);

  useEffect(() => {
    dispatch(getSelectedPost(postType, id));
  }, [postType, id, dispatch]);

  return selectedPost && <PostEditItem postObj={selectedPost} />;
};

export default PostEdit;

const PostEditItem = ({ postObj }) => {
  const classes = useStyles();
  const [editPost, setEditPost] = useState(postObj);

  const onInputChange = (e) => {
    setEditPost({
      ...postObj,
      content: e.target.value
    });
  };

  return (
    <PostItemWrapper>
      {postObj.question && <QuestionBox questionObj={postObj.question} />}
      <TextareaAutosize
        autoFocus
        id="new-post-input"
        name="content"
        placeholder={
          postObj.type === 'Article'
            ? '떠오르는 생각을 공유해주세요.'
            : '답변을 작성해주세요'
        }
        value={editPost.content}
        onChange={onInputChange}
        className={classes.textarea}
      />
      <ShareSettings postObj={editPost} edit />
    </PostItemWrapper>
  );
};
