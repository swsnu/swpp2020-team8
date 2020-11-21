import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

const NewCommentWrapper = styled.div`
  width: 100%;
  display: flex;
`;

NewCommentWrapper.displayName = 'NewCommentWrapper';
const NewCommentInput = styled.input`
  outline: none;
  flex-grow: 1;
  padding: 6px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export default function NewComment({ isReply = false, onSubmit }) {
  const [content, setContent] = useState('');
  const placeholder = isReply ? '답글을 입력하세요.' : '댓글을 입력하세요.';

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleSubmit = () => {
    if (!content) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <NewCommentWrapper>
      {isReply && <SubdirectoryArrowRightIcon />}
      <NewCommentInput
        id="comment-input"
        placeholder={placeholder}
        onChange={handleContentChange}
        onKeyDown={handleEnter}
        value={content}
      />
      <Button
        onClick={handleSubmit}
        id="submit-button"
        style={{ padding: '4px' }}
        color="secondary"
      >
        작성
      </Button>
    </NewCommentWrapper>
  );
}
