const apiUrl = "http://localhost:8000"

const normalize = (res) => {
  const status = res.status;
  const response = res.json();
  return { status, response };
};

export const createReaction = (reaction) => {
    return fetch(`${apiUrl}/reactions`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reaction)
    }).then(normalize)
}   

export const updateReaction = (reaction) => {
    return fetch(`${apiUrl}/reactions/${reaction.id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reaction)
    }).then(normalize)
}

export const deleteReaction = (reactionId) => {
    return fetch(`${apiUrl}/reactions/${reactionId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(normalize)
}