import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    sortOrder: "ASCENDING",
    userSortOrder: "ASCENDING",
    user: null,
    token: null,
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setSortOrder: (state, action) => {
            state.sortOrder = state.sortOrder === "ASCENDING" ? "DESCENDING" : "ASCENDING";
        },
        setUserSortOrder: (state, action) => {
            state.userSortOrder = state.userSortOrder === "ASCENDING" ? "DESCENDING" : "ASCENDING";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setSavePosts: (state, action) => {
            if (state.user) {
                state.user.savePosts = action.payload.savePosts;
            } else {
                console.log("post not-exist :(");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id)
                    return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
        }
    }
});

export const { setMode, setSortOrder, setUserSortOrder, setLogin, setLogout, setPosts,
    setPost, setUser, setSavePosts } = authSlice.actions;

export default authSlice.reducer;  