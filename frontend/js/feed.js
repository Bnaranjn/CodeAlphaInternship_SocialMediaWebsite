const API_URL = "http://localhost:3000/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "login.html";
}

const feed = document.getElementById("feed");
const postBtn = document.getElementById("postBtn");
const postContent = document.getElementById("postContent");
const logoutBtn = document.getElementById("logoutBtn");

// -----------
//logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

//-----------
//create Post

postBtn.addEventListener("click", createPost);
async function createPost() {
  const content = postContent.value.trim();
  if (!content) {
    alert("Please enter some text.");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        content,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      return;
    }
    postContent.value = "";
    loadPosts();
  } catch (error) {
    console.log(error);
  }
}
// --------------------
//loading posts

async function loadPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();
    feed.innerHTML = "";

    posts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";

      postCard.innerHTML = `

<div class="post-header">

    <div>

        <strong>${post.author.username}</strong>

    </div>

    ${
      post.author._id !== user.id
        ? `<button class="follow-btn" onclick="followUser('${post.author._id}')">
                    Follow
               </button>`
        : ""
    }

</div>

<div class="post-content">

    ${post.content}

</div>

<div class="post-actions">

    <button onclick="likePost('${post._id}')">

        ❤️ ${post.likes.length}

    </button>

</div>

<div id="comments-${post._id}" class="comments"></div>

<input
    class="comment-input"
    id="input-${post._id}"
    placeholder="Write a comment..."
>

<button onclick="addComment('${post._id}')">

    Comment

</button>

`;
      feed.appendChild(postCard);

      loadComments(post._id);
    });
  } catch (error) {
    console.log(error);
  }
}

// --------
//like
// ----

async function likePost(postId) {
  try {
    await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadPosts();
  } catch (error) {
    console.log(error);
  }
}

//followuser
async function followUser(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    alert(data.message);

    loadPosts();
  } catch (error) {
    console.log(error);
  }
}
// -----------
//load comments
// -------

async function loadComments(postId) {
  try {
    const response = await fetch(`${API_URL}/comments/${postId}`);

    const comments = await response.json();

    const container = document.getElementById(`comments-${postId}`);

    container.innerHTML = "";

    comments.forEach((comment) => {
      const p = document.createElement("p");

      p.innerHTML = `<strong>${comment.author.username}</strong>: ${comment.text}`;

      container.appendChild(p);
    });
  } catch (error) {
    console.log(error);
  }
}

// --------------------
// add Comment
// --------------------

async function addComment(postId) {
  const input = document.getElementById(`input-${postId}`);

  const text = input.value.trim();

  if (!text) return;

  try {
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);

      return;
    }

    input.value = "";

    loadComments(postId);

    loadPosts();
  } catch (error) {
    console.log(error);
  }
}

loadPosts();
