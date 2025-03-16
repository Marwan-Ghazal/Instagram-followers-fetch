const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Environment variables
const SESSION_ID = process.env.INSTA_SESSION_ID;
const CSRF_TOKEN = process.env.INSTA_CSRF_TOKEN;

app.get('/followers/:username', async (req, res) => {
  try {
    const response = await axios.get(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${req.params.username}`,
      {
        headers: {
          "User-Agent": "Instagram 250.0.0.0 Android",
          "Cookie": `sessionid=${SESSION_ID}; csrftoken=${CSRF_TOKEN}`,
          "X-CSRFToken": CSRF_TOKEN
        }
      }
    );

    if (response.status !== 200) {
      return res.status(400).json({
        success: false,
        error: "Instagram API request failed"
      });
    }

    const followers = response.data.data.user.edge_followed_by.count;
    
    res.json({
      success: true,
      followers: followers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

app.listen(port, () => {
  console.log(`Follower count service running on port ${port}`);
});