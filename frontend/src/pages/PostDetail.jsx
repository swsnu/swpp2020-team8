import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router';
import { getSelectedPostSuccess } from '../modules/post';
// import QuestionItem from '../components/posts/QuestionItem';
import PostItem from '../components/posts/PostItem';
// import PostList from '../components/posts/PostList';

const mockPost = {
  id: 1,
  'content-type': 'Article',
  is_admin_question: 'true',
  author_detail: {
    id: 1,
    username: 'admin',
    profile_pic: null
  },
  content: '사람들의 무리한 부탁을 잘 거절하는 편',
  comments: [
    {
      id: 1272,
      post_id: 383,
      content: '재밌네요',
      author: 1,
      author_detail: {
        id: 123,
        username: 'curious',
        profile_pic:
          'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg'
      },
      referenced_comments: 1272,
      is_reply: false,
      replies: [
        {
          id: 1273,
          post_id: 383,
          content: '같이하고싶어요',
          author: 2,
          author_detail: {
            id: 2,
            profile_pic:
              'https://www.publicdomainpictures.net/pictures/260000/velka/dog-face-cartoon-illustration.jpg',
            username: '아이폰'
          },
          is_poster_owner: false,
          referenced_comments: 1272,
          is_reply: true,
          is_private: false,
          create_dt: '2020-09-23T10:40:24.421000+08:00',
          update_dt: '2020-09-23T10:40:24.428734+08:00'
        }
      ],
      is_private: false,
      create_dt: '2020-09-23T10:38:47.975019+08:00',
      update_dt: '2020-09-23T10:39:35.849029+08:00'
    },
    {
      id: 1274,
      post_id: 383,
      content: '퍼가요!!!!',
      author: 3,
      author_detail: {
        id: 2,
        profile_pic:
          'https://images.vexels.com/media/users/3/144928/isolated/preview/ebbccaf76f41f7d83e45a42974cfcd87-dog-illustration-by-vexels.png',
        username: '아이폰'
      },
      referenced_comments: 1274,
      is_reply: false,
      is_private: true,
      create_dt: '2020-09-23T10:40:42.268355+08:00',
      update_dt: '2020-09-23T10:40:42.268384+08:00'
    }
  ],
  created_at: '2020-11-05T14:16:13.801119+08:00',
  updated_at: null
};

export default function PostDetail() {
  const selectedPost = useSelector((state) => state.postReducer.selectedPost);
  //   const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getSelectedPost({ id }));
    dispatch(getSelectedPostSuccess(selectedPost));
  }, [dispatch]);
  // [id, dispatch]

  console.log(selectedPost);

  return (
    <div id="post-detail">
      <PostItem postObj={mockPost} />
      <PostItem postObj={selectedPost} />
    </div>
  );
}
