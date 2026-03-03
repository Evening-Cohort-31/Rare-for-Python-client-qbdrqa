const apiUrl = "http://localhost:8000"

const normalize = (res) => {
  const status = res.status;
  const response = res.json();
  return { status, response };
};

// GET all categories
export const getCategories = () => {
    return fetch(`${apiUrl}/categories`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(normalize)
}

//POST category
export const createCategory = (category) => {
    return fetch(`${apiUrl}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(category)
    }).then(normalize)
}

//GET Category by ID
export const getCategoryById = (id) => {
    return fetch(`${apiUrl}/categories/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(normalize)
}

//PUT Category
export const updateCategory = (categoryId, category) => {
  return fetch(`${apiUrl}/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(category),
  }).then(normalize)
}

// DELETE Category
export const deleteCategory = (categoryId) => {
  return fetch(`${apiUrl}/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => ({ status: res.status }))
}