const normalize = (res) => {
  const status = res.status
  const response = res.json()
  return { status, response }
}

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

export const toggleUserActivation = (user) => {
  return fetch(`http://localhost:8000/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "Application/json"
    },
    body: JSON.stringify(user)
  })
    .then(normalize)
}

export const getUserById = (userId) => {
  return fetch(`http://localhost:8000/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}

export const getHomePage = (userId) => {
  return fetch(`http://localhost:8000/home_page/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}