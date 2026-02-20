const apiUrl = "http://localhost:8000"

const normalize = async (res) => {
  const status = res.status
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  return { status, response: Promise.resolve(data) }
}

export const createComment = (comment) => {
  return fetch(`${apiUrl}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(comment)
  }).then(normalize)
}

export const getCommentsByPostId = (postId) => {
  return fetch(`${apiUrl}/comments?post_id=${postId}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}
