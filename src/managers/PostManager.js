const apiUrl = "http://localhost:8000";

const normalize = (res) => {
  const status = res.status;
  const response = res.json();
  return { status, response };
};

// Get Approved Published Posts
export const getApprovedPublishedPosts = () => {
  return fetch(`${apiUrl}/posts`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};

// Create New Entry in the posts database
export const getUnapprovedPosts = () => {
  return fetch(`${apiUrl}/posts?approved=false`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};

// Get Post Title for Comments Page
export const getPostTitle = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then((res) => {
    const status = res.status
    const response = res.json()
    return { status, response }
  })
}

// Create a new entry in the posts database
export const createPost = (post) => {
  const formData = new FormData()
  formData.append("user_id", post.user_id)
  formData.append("category_id", post.category_id)
  formData.append("title", post.title)
  if (post.image) formData.append("image", post.image)
  formData.append("content", post.content)
  formData.append("tags", post.tags)
  formData.append("approved", post.approved ? 1 : 0)

  return fetch(`${apiUrl}/post`, {
    method: "POST",
    body: formData,
  }).then(normalize);
};

// Get All Specific User's posts
export const getPostByUserId = (userId) => {
  return fetch(`${apiUrl}/posts?user_id=${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};

// Edit Single Post
export const editPost = (post) => {
  const formData = new FormData()
  formData.append("user_id", post.user_id)
  formData.append("category_id", post.category_id)
  formData.append("title", post.title)
  if (post.image !== null) formData.append("image", post.image)
  formData.append("content", post.content)
  formData.append("tags", post.tags)
  formData.append("approved", post.approved)
  formData.append("id", post.id)

  return fetch(`${apiUrl}/posts/${post.id}`, {
    method: "PUT",
    body: formData,
  }).then(normalize);
};

// Details Page
export const getPostById = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};

export const approvePost = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      approved: true,
    }),
  }).then(normalize);
};

export const getPostByTag = (tagId) => {
  return fetch(`${apiUrl}/posts?tag_id=${tagId}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};

export const searchPostsByTitle = (searchTerm) => {
  return fetch(`${apiUrl}/posts?title=${searchTerm}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};

export const deletePost = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(normalize);
};

export const getSubscribedPosts = (id) => {
  return fetch(`${apiUrl}/posts/${id}?subscriptions=true`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(normalize);
};
