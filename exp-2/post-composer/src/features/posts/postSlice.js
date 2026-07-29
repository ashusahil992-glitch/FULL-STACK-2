import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    updatePost: (state, action) => {
      const { index, post } = action.payload;
      state.posts[index] = post;
    },

    deletePost: (state, action) => {
      state.posts.splice(action.payload, 1);
    },
  },
});

export const { addPost, updatePost, deletePost } = postSlice.actions;

export default postSlice.reducer;