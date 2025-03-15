const axios = require("axios");
const SESSION_ID = "44403450588%3ATONHXIablYJyXQ%3A15%3AAYed5uHPd09ALjpB7gFRzT8DTEyRdNbyWvs3VXXd1A";
const CSRF_TOKEN = "vWmz5wLHK25YgNd9ZOE_iB";
async function fetchInstagramProfile(username) {
   const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
   const headers = {
       "User-Agent": "Instagram 250.0.0.0 Android",
       "Referer": "https://www.instagram.com/",
       "X-CSRFToken": CSRF_TOKEN,
       "X-Instagram-AJAX": "1",
       "X-Requested-With": "XMLHttpRequest",
       "Accept-Language": "en-US,en;q=0.9",
       "Cookie": `sessionid=${SESSION_ID}; csrftoken=${CSRF_TOKEN}`
   };
   try {
       await new Promise(resolve => setTimeout(resolve, Math.random() * (5000 - 2000) + 2000));
       const response = await axios.get(url, { headers });
       if (response.status !== 200) {
           console.error(`❌ Failed to fetch data for ${username}. Status Code:`, response.status);
           return { success: false, profile: {} };
       }
       const data = response.data;
       const user = data.data.user;
       return {
           success: true,
           profile: {
               name: user.full_name || "Unknown",
               profileurl: `https://www.instagram.com/${username}/`,
               username: username,
               followers: user.edge_followed_by.count,
               following: user.edge_follow.count,
               posts: user.edge_owner_to_timeline_media.count,
               aboutinfo: user.biography || "No description available",
               profile_pic_url: user.profile_pic_url_hd
           }
       };
   } catch (error) {
       console.error("❌ Error fetching data:", error.message);
       return { success: false, profile: {} };
   }
}
(async () => {
   const username =  process.argv[2] ||"cristiano";
   const profileData = await fetchInstagramProfile(username);
   console.log(JSON.stringify(profileData, null, 4));
})();