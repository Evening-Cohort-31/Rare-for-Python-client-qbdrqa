const apiUrl = "http://localhost:8000"

const normalize = async (res) => {
  const contentType = res.headers.get("content-type") || ""
  if (res.status === 204) {
    return { status: res.status, response: Promise.resolve(null) }
  }
  if (contentType.includes("application/json")) {
    return { status: res.status, response: res.json() }
  }
  return { status: res.status, response: Promise.resolve(null) }
}

export const getCommentsByPostId = (postId) => {
  return fetch(`${apiUrl}/comments?post_id=${postId}`, {
    headers: {
      Accept: "application/json",
    },
  }).then(normalize)
}

export const getCommentById = (commentId) => {
  return fetch(`${apiUrl}/comments/${commentId}`, {
    headers: {
      Accept: "application/json",
    },
  }).then(normalize)
}

export const createComment = ({ post_id, subject, content }) => {
  const commentToSend = {
    post_id: Number(post_id),
    author_id: Number(localStorage.getItem("auth_token")),
    subject: subject ?? "",
    content,
  }

  return fetch(`${apiUrl}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(commentToSend),
  }).then(normalize)
}

export const updateComment = (commentId, comment) => {
  const commentToSend = {
    id: Number(commentId),
    post_id: Number(comment.post_id),
    author_id: Number(localStorage.getItem("auth_token")),
    subject: comment.subject ?? "",
    content: comment.content,
  }

  return fetch(`${apiUrl}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(commentToSend),
  }).then(normalize)
}

export const deleteComment = (commentId) => {
  return fetch(`${apiUrl}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  }).then(normalize)
}