export const IsAdmin = async (userId) => {
    const isAdmin = await fetch(`http://localhost:8000/user/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    }).then(async res => {
        const response = await res.json()
        
        return response.type === "Admin"
    })

    return isAdmin
}