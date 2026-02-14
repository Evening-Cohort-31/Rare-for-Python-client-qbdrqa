const apiUrl = "http://localhost:8000"

// GET all categories
export const getCategories = () => {
    fetch(`${apiUrl}/categories`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(async res => {
        const status = res.status
        const response = await res.response

        return {status: status, response: response}
    })
}

//POST category
export const createCategory = (category) => {
    fetch(`${apiUrl}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(category)
    }).then(async res => {
        const status = res.status
        const response = await res.response

        return {status: status, response: response}
    })
}

//GET Category by ID
export const getCategoryById = (id) => {
    fetch(`${apiUrl}/categories/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(async res => {
        const status = res.status
        const response = await res.response

        return {status: status, response: response}
    })
}