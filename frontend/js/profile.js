const API_URL = "http://localhost:3000/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  window.location.href = "login.html";
}

const username = document.getElementById("username");
const bio = document.getElementById("bio");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const userPosts = document.getElementById("userPosts");

//---------------
//load Profile
async function loadProfile() {
  try {
    const response = await fetch(`${API_URL}/users/${user.id}`);

    const data = await response.json();

    const profile = data.user;

    username.innerText = profile.username;

    bio.innerText = profile.bio || "No bio yet.";

    followers.innerText = profile.followers.length;

    following.innerText = profile.following.length;

    const followersList = document.getElementById("followersList");
    const followingList = document.getElementById("followingList");

    followersList.innerHTML = "";
    followingList.innerHTML = "";

    if (profile.followers.length === 0) {
      followersList.innerHTML = "<li>No followers yet</li>";
    } else {
      profile.followers.forEach((person) => {
        followersList.innerHTML += `<li>${person.username}</li>`;
      });
    }

    if (profile.following.length === 0) {
      followingList.innerHTML = "<li>Not following anyone</li>";
    } else {
      profile.following.forEach((person) => {
        followingList.innerHTML += `<li>${person.username}</li>`;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// ------------------------
//load user posts
async function loadMyPosts() {
  const response = await fetch(`${API_URL}/users/${user.id}`);

  const data = await response.json();

  userPosts.innerHTML = "";

  data.posts.forEach((post) => {
    userPosts.innerHTML += `

        <div class="post-card">

            <p>${post.content}</p>

            <small>
                ❤️ ${post.likes.length} Likes
            </small>

        </div>

        `;
  });
}
loadProfile();

loadMyPosts();
