const apiUrl = "http://localhost:8000"

export const getApprovedPublishedPosts = () => {
  return fetch(`${apiUrl}/posts`, {
    headers: {
      "Authorization": `Token ${localStorage.getItem("rare_token")}`,
      "Accept": "application/json"
    }
  }).then(res => res.json())
}

// Create a new entry in the posts database
export const createPost = (post) => {
    return fetch(`${apiUrl}/new_post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(post)
    }).then(res => {
        const status = res.status
        const response = res.json();

        return {status: status, response: response}
        })
}

//Get all of a user's posts
export const getPostByUserId = (userId) => {
  return fetch(`${apiUrl}/posts?user_id=${userId}`, {
    headers: {
      "Accept": "application/json"
    }
  }).then(res => {
    const status = res.status
    const response = res.json();

    return {status: status, response: response}
  })
}

//Edit a single post
export const editPost = (post) => {
  console.log(post)
  return fetch(`${apiUrl}/posts/${post.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(post)
  }).then(res => {
    const status = res.status
    const response = res.json();

      return {status: status, response: response}
  })
}

//Get a post by it's id
export const getPostById = (id) => {
  return fetch(`${apiUrl}/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(res => {
    const status = res.status
    const response = res.json()

    return {status: status, response: response}
  })
}