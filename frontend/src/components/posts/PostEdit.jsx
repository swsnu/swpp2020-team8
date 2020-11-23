import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
// import { getSelectedPost } from '../../modules/post';

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

const mockCustomQuestion = {
  id: 4758,
  'content-type': 'Question',
  is_admin_question: 'true',
  author_detail: {
    id: 123,
    username: 'curious',
    profile_pic:
      'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
  },
  content: '올해가 가기 전에 꼭 이루고 싶은 목표가 있다면~?',
  comments: [],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export default function PostEdit() {
  const [postInfo, setPostInfo] = useState({
    id: 0,
    content: ''
  });
  const textareaRef = useRef(null);
  // const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  const dispatch = useDispatch();

  // TODO: fix with API Linking
  useEffect(() => {
    // dispatch(getSelectedPost());
    setPostInfo(mockCustomQuestion);
  }, [dispatch]);

  // useEffect(() => {
  //   setPostInfo(selectedPost);
  // }, [selectedPost]);

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
