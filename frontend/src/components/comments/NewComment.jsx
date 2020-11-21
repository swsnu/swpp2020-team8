import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

const NewCommentWrapper = styled.div`
  width: 100%;
`;
const NewCommentInput = styled.input`
  outline: none;
  padding: 6px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export default function NewComment({ isReply = false, commentId = null }) {
  const [content, setContent] = useState('');
  const placeholder = isReply ? '답글을 입력하세요.' : '댓글을 입력하세요.';

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = () => {
    console.log(commentId);
  };
  return (
    <NewCommentWrapper>
      {isReply && <SubdirectoryArrowRightIcon />}
      <NewCommentInput
        placeholder={placeholder}
        onChange={handleContentChange}
        value={content}
      />
      <Button
        onClick={handleSubmit}
        style={{ padding: '4px' }}
        color="secondary"
      >
        작성
      </Button>
    </NewCommentWrapper>
  );
}
