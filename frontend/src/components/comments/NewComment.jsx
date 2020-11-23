import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox, Button } from '@material-ui/core';
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

const PrivateWrapper = styled.div`
  font-size: 10px;
  display: flex;
  align-items: center;
  margin-left: 3px;
`;

export default function NewComment({
  isReply = false,
  onSubmit,
  forcePrivate = false
}) {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(forcePrivate);
  const placeholder = isReply ? '답글을 입력하세요.' : '댓글을 입력하세요.';

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const togglePrivate = () => {
    if (forcePrivate) return;
    setIsPrivate((prev) => !prev);
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
    onSubmit(content, isPrivate);
    setContent('');
  };

  return (
    <NewCommentWrapper>
      {isReply && <SubdirectoryArrowRightIcon />}
      <NewCommentInput
        className="comment-input"
        placeholder={placeholder}
        onChange={handleContentChange}
        onKeyDown={handleEnter}
        value={content}
      />
      <PrivateWrapper>
        <Checkbox
          id="check-private"
          checked={isPrivate}
          onChange={togglePrivate}
          size="small"
          style={{ padding: 0 }}
        />
        비밀 댓글
      </PrivateWrapper>
      <Button
        onClick={handleSubmit}
        id="submit-button"
        style={{ padding: '4px', minWidth: '50px', marginLeft: '3px' }}
        color="secondary"
      >
        작성
      </Button>
    </NewCommentWrapper>
  );
}
