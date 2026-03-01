export const loginUser = (user) => {
  return fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      username: user.username,
      password: user.password
    })
  }).then(res => res.json())
}

export const registerUser = (newUser) => {
  const formData = new FormData()
  formData.append("username", newUser.username)
  formData.append("first_name", newUser.first_name)
  formData.append("last_name", newUser.last_name)
  formData.append("email", newUser.email)
  formData.append("password", newUser.password)
  formData.append("bio", newUser.bio)
  formData.append("type", newUser.type)
  
  if (newUser.profile_image) {
    formData.append("profile_image", newUser.profile_image)
  }

  return fetch("http://localhost:8000/register", {
    method: "POST",
    body: formData
  }).then(res => res.json())
}
