const apiUrl = "http://localhost:8000"

const normalize = (res) => {
  const status = res.status
  const response = res.json()
  return { status, response }
}

// Get Approved Published Posts
export const getApprovedPublishedPosts = () => {
  return fetch(`${apiUrl}/posts`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}

// Create New Entry in the posts database
export const createPost = (post) => {
  return fetch(`${apiUrl}/new_post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(post)
  }).then(normalize)
}

// Get All Specific User's posts
export const getPostByUserId = (userId) => {
  return fetch(`${apiUrl}/posts?user_id=${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}

// Edit Single Post
export const editPost = (post) => {
  return fetch(`${apiUrl}/posts/${post.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(post)
  }).then(normalize)
}

// Details Page
export const getPostById = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}