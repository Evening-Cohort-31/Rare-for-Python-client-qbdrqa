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

<<<<<<< jn/ft/view_detail_post
// Create New Entry in the posts database
=======
export const getUnapprovedPosts = () => {
  return fetch(`${apiUrl}/posts?approved=false`, {
    headers: {
      "Accept": "application/json"
    }
  })
}

// Create a new entry in the posts database
>>>>>>> develop
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
<<<<<<< jn/ft/view_detail_post
  }).then(normalize)
=======
  }).then(res => {
    const status = res.status
    const response = res.json()

    return {status: status, response: response}
  })
}

export const approvePost = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "approved" : true
    })
  }).then(res => {
    const status = res.status
    const response = res.json()

    return {status: status, response: response}
  })
>>>>>>> develop
}