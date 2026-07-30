import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts.posts;

// Memoized selector for all posts
export const selectAllPosts = createSelector(
  [selectPosts],
  (posts) => posts
);

// Derived state: total posts
export const selectTotalPosts = createSelector(
  [selectPosts],
  (posts) => posts.length
);

// Derived state: Twitter posts
export const selectTwitterPosts = createSelector(
  [selectPosts],
  (posts) => posts.filter((post) => post.platform === "Twitter")
);

// Derived state: Facebook posts
export const selectFacebookPosts = createSelector(
  [selectPosts],
  (posts) => posts.filter((post) => post.platform === "Facebook")
);

// Derived state: LinkedIn posts
export const selectLinkedInPosts = createSelector(
  [selectPosts],
  (posts) => posts.filter((post) => post.platform === "LinkedIn")
);

// Derived state: Instagram posts
export const selectInstagramPosts = createSelector(
  [selectPosts],
  (posts) => posts.filter((post) => post.platform === "Instagram")
);