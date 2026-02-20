export const IsAdmin = async (userId) => {
    const isAdmin = await fetch(`http://localhost:8000/users/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    }).then(async res => {
        const response = await res.json()

        console.log(response)
        
        return response.type === "Admin"
    })

    return isAdmin
}