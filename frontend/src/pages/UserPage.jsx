// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import PostList from '../components/posts/PostList';
// import { getPostsByType, getSelectedPost } from '../modules/user';
// import { useParams } from "react-router";
// import QuestionItem from "../components/posts/QuestionItem";
// import PostItem from "../components/posts/PostItem";
//
// export default function UserPage() {
//     const selectedPost = useSelector((state) => state.userReducer.selectedUser);
//     const { id } = useParams();
//     const dispatch = useDispatch();
//
//     useEffect(() => {
//         dispatch(getSelectedUser(id));
//     }, [postType, id, dispatch]);
//
//     if (
//         selectedPost?.type === 'Question' ||
//         selectedPost?.['content-type'] === 'Question'
//     )
//         return (
//             <div id="post-detail-question">
//                 {selectedPost && <QuestionItem questionObj={selectedPost} />}
//             </div>
//         );
//     return (
//         <div id="post-detail-not-question">
//             {selectedPost && <PostItem postObj={selectedPost} />}
//         </div>
//     );
// }
//
// const FriendFeed = () => {
//   const dispatch = useDispatch();
//   const friendPosts = useSelector((state) => state.postReducer.friendPosts);
//
//   useEffect(() => {
//     dispatch(getPostsByType('friend'));
//   }, [dispatch]);
//
//   return (
//     <>
//       <PostList posts={friendPosts} />
//     </>
//   );
// };
//
// export default FriendFeed;
