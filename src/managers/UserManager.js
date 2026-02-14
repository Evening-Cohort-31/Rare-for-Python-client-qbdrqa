export const getAllUsers = () => {
  return fetch("http://localhost:8000/users", {
    headers: {
      "Authorization": `Token ${localStorage.getItem("auth_token")}`
    }
  })
    .then(res => {
      if (!res.ok) {
        throw Error(`Server returned ${res.status}: ${res.statusText}`)
      }
      return res.json()
    })
}