// /src/api/apiService.js
import axios from "axios";

// Base URL of your deployed backend
const API_BASE = "https://twitter-clone-app-6.onrender.com";

// ------------------- AUTH -------------------

// Register user
export const registerUser = async (data) => {
  return await axios.post(`${API_BASE}/api/auth/register`, data, {
    withCredentials: true,
  });
};

// Login user
export const loginUser = async (data) => {
  return await axios.post(`${API_BASE}/api/auth/login`, data, {
    withCredentials: true,
  });
};

// ------------------- USER -------------------

// Fetch logged-in user
export const fetchLoggedInUser = async (email) => {
  return await axios.get(`${API_BASE}/loggedinuser`, {
    params: { email },
    withCredentials: true,
  });
};

// Update user details
export const updateUser = async (email, data) => {
  return await axios.patch(`${API_BASE}/userupdate/${email}`, data, {
    withCredentials: true,
  });
};

// Toggle notifications
export const updateNotifications = async (email, enabled) => {
  return await axios.patch(
    `${API_BASE}/user/notifications/${email}`,
    { enabled },
    { withCredentials: true }
  );
};

// ------------------- TWEETS -------------------

// Post a new tweet
export const postTweet = async (tweetData) => {
  return await axios.post(`${API_BASE}/post`, tweetData, {
    withCredentials: true,
  });
};

// Get all tweets
export const fetchTweets = async () => {
  return await axios.get(`${API_BASE}/post`, {
    withCredentials: true,
  });
};

// Like a tweet
export const likeTweet = async (tweetId, userId) => {
  return await axios.post(
    `${API_BASE}/like/${tweetId}`,
    { userId },
    { withCredentials: true }
  );
};

// Retweet a tweet
export const retweet = async (tweetId, userId) => {
  return await axios.post(
    `${API_BASE}/retweet/${tweetId}`,
    { userId },
    { withCredentials: true }
  );
};
