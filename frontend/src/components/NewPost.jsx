import React, { useState } from 'react';
import styled from 'styled-components';
import ShareSettings from './ShareSettings';

const NewPostWrapper = styled.div`
  width: 700px;
  margin: 0 auto;
  margin-top: 50px;
  border: 1px solid #ddd;
  padding: 10px 10px;
  padding-bottom: 30px;
`;

export const NewPostInput = styled.textarea`
  padding: 5px;
  border-radius: 2px;
  color: rgb(50, 50, 50);
  font-size: 16px;
  outline: none;
  width: 700px;
  height: 100px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  margin: 4px 0;
  border-color: ${(props) => props.invalid && '#ff395b'};
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #aaa;
  }
  :focus {
    border-color: #008489;
  }
  cursor: auto;
  resize: none;
`;

export default function NewPost() {
  const [postInput, setPostInput] = useState({
    content: ''
  });

  const onPostInputChange = (e) => {
    setPostInput(e.target.value);
  };

  return (
    <NewPostWrapper>
      <NewPostInput
        id="new-post-input"
        placeholder="떠오르는 생각을 공유해주세요."
        value={postInput.content}
        onChange={onPostInputChange}
      />
      <ShareSettings />
    </NewPostWrapper>
  );
}
