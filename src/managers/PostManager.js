const apiUrl = "http://localhost:8000"

export const getApprovedPublishedPosts = () => {
  return fetch(`${apiUrl}/posts`, {
    headers: {
      "Authorization": `Token ${localStorage.getItem("rare_token")}`,
      "Accept": "application/json"
    }
  }).then(res => res.json())
}