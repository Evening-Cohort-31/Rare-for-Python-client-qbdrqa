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

export const addSubscription = (userId, subId) => {
  return fetch(`http://localhost:8000/users/${userId}?sub_id=${subId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}

export const removeSubscription = (userId, subId) => {
  return fetch(`http://localhost:8000/users/${userId}?sub_id=${subId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(normalize)
}

export const updateUser = (user) => {
  return fetch(`http://localhost:8000/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(user)
  }).then(normalize)
}