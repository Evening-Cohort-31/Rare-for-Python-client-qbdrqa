import { useParams } from "react-router-dom"
import { getPostByUserId } from "../../managers/PostManager.js"
import { useEffect, useState } from "react"

export const MyPosts = () => {
    const {token : userId} = useParams()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({error: false, message: ""})

    useEffect(() => {
        setLoading(true)
        getPostByUserId(userId).then(async res => {
            setLoading(false)
            if (res.status === 200) {
                const response = await res.response
                setPosts(response)
            } else if (res.status >=400 && res.status <500) {
                setError({error: true, message: "Action not supported"})
            } else if (res.status >=500) {
                setError({error: true, message: "Server error"})
            } else {
                setError({error: true, message: "An unexpected error has occurred"})
            }
        }).catch(err => {
            setLoading(false)
            setError({error: true, message: "An unexpected error has occurred."})
        })
    }, [userId])
    
    return (
        <>
        </>
    )
}