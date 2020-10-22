const initialState = {
  anonymousPosts: [],
  friendPosts: [],
  selectedUserPosts: [],
  selectedPost: {}
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
