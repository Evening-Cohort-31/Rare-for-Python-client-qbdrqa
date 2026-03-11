const apiUrl = "http://localhost:8000"

export const getAllTags = () => {
    return fetch(`${apiUrl}/tags`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => {
        return {status: res.status, response: res.json()}})
}

export const getTagById = (id) => {
    return fetch(`${apiUrl}/tags/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => {
        return {status: res.status, response: res.json()}
    })
}

export const createTag = (tag) => {
    return fetch(`${apiUrl}/tags`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(tag)
    }).then(res => {
        return {status: res.status, response: res.json()}
    })
}

export const updateTag = (tagId, tag) => {
  return fetch(`${apiUrl}/tags/${tagId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(tag),
  }).then(normalize)
}

export const deleteTag = (tagId) => {
  return fetch(`${apiUrl}/tags/${tagId}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
  }).then(normalize)
}