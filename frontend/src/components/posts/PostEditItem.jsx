import React, { useState } from 'react';
import { TextareaAutosize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PostItemWrapper } from '../../styles';
import QuestionBox from './QuestionBox';
import ShareSettings from './ShareSettings';

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
    overflow: 'hidden',
    fontFamily: 'Noto Sans KR, sans-serif'
  }
});

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
      {postObj?.question && <QuestionBox questionObj={postObj.question} />}
      <TextareaAutosize
        autoFocus
        id="edit-post-input"
        name="content"
        placeholder={
          postObj?.type === 'Article'
            ? '떠오르는 생각을 공유해주세요.'
            : '답변을 작성해주세요'
        }
        value={editPost?.content}
        onChange={onInputChange}
        className={classes.textarea}
      />
      <ShareSettings postObj={editPost} edit />
    </PostItemWrapper>
  );
};

export default PostEditItem;
