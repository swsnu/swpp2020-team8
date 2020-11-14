import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getSelectedPost } from '../../modules/post';
import ShareSettings from '../ShareSettings';

const PostEditWrapper = styled.div`
  width: 650px;
  margin: 0 auto;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const PostEditInput = styled.textarea`
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

export default function PostEdit() {
  const [postInfo, setPostInfo] = useState({
    id: 0,
    content: ''
  });
  const textareaRef = useRef(null);
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSelectedPost());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPost && selectedPost.id) setPostInfo(selectedPost);
  }, [selectedPost]);

  useEffect(() => {
    textareaRef.current.style.height = '100px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [postInfo]);

  const onContentInputChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <PostEditWrapper>
      <PostEditInput
        id="new-post-input"
        name="content"
        ref={textareaRef}
        value={postInfo.content}
        onChange={onContentInputChange}
      />
      <ShareSettings />
    </PostEditWrapper>
  );
}
