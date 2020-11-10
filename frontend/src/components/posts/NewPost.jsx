import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ShareSettings from '../ShareSettings';

const NewPostWrapper = styled.div`
  width: 650px;
  margin: 0 auto;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const NewPostInput = styled.textarea`
  padding: 5px;
  border-radius: 2px;
  color: rgb(50, 50, 50);
  font-size: 14px;
  outline: none;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  border: none;
  margin: 4px 0;
  box-sizing: border-box;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #aaa;
  }
  :focus {
    outline: 'none !important';
  }
  cursor: auto;
  resize: none;
  overflow: hidden;
`;

export default function NewPost() {
  const [postInfo, setPostInfo] = useState({
    content: ''
  });

  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.style.height = '100px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [postInfo]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <NewPostWrapper>
      <NewPostInput
        id="new-post-input"
        name="content"
        placeholder="떠오르는 생각을 공유해주세요."
        ref={textareaRef}
        value={postInfo.content}
        onChange={onInputChange}
      />
      <ShareSettings />
    </NewPostWrapper>
  );
}
