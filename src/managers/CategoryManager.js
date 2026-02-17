const apiUrl = "http://localhost:8000"

// GET all categories
export const getCategories = () => {
    return fetch(`${apiUrl}/categories`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => {
        const status = res.status
        const response = res.json()

        return {status: status, response: response}
    })
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
    }).then(res => {
        const status = res.status
        const response = res.json()

        return {status: status, response: response}
    })
}

//GET Category by ID
export const getCategoryById = (id) => {
    return fetch(`${apiUrl}/categories/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => {
        const status = res.status
        const response = res.json()

        return {status: status, response: response}
    })
}