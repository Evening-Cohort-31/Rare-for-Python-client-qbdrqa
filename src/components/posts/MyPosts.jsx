import { useNavigate, useParams } from "react-router-dom"
import { getPostByUserId } from "../../managers/PostManager.js"
import { useEffect, useState } from "react"
import { MdEdit } from "react-icons/md"
import { Post } from "./Post.jsx"

// Component to display a user's posts
export const MyPosts = () => {
    const {userId} = useParams()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({error: false, message: ""})
    const navigate = useNavigate()

    // Grab the users's posts on load
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

    //TODO: Add pagination, add method to view post detail (navigate or expand)
    // Better styling, loading indicator, error handling/message displays
    return (
        <div className="columns is-centered">
            <div className="column is-one-third">
                <h1 className="title">My Posts</h1>
                {/*Displays a skeleton while loading */}
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div className="card is-skeleton" key={i} style={{marginTop: "10px", minHeight: 150}}/>
                    ))
                ) : posts.length > 0 ? posts.map((post) => (
                    <Post post={post} edit key={post.id}/>
                )) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    )
}