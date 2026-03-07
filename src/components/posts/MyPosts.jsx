import { useNavigate, useParams } from "react-router-dom"
import { getPostByUserId } from "../../managers/PostManager.js"
import { useEffect, useMemo, useState } from "react"
import { Post } from "./Post.jsx"
import { getUserById } from "../../managers/UserManager.js"

// Component to display a user's posts
export const MyPosts = () => {
    const {userId} = useParams()
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({error: false, message: ""})

    const isAuthor = useMemo(() => {
        return userId === localStorage.getItem("auth_token")
    },[userId])

    // Grab the users's posts on load
    useEffect(() => {
        const loadData = async (userId) => {
        setLoading(true)
        const [user, userPosts] = await Promise.all([
            getUserById(userId),
            getPostByUserId(userId)])
            
        setLoading(false)
        if (user.status === 200 && userPosts.status === 200) {
            setPosts(await userPosts.response)
            setUser(await user.response)
        } else if ((user.status >=400 && user.status < 500) || (userPosts.status >=400 && user.status < 500)) {
            setError({error: true, message: "Action not supported"})
        } else if (user.status > 500 || userPosts.status > 500) {
            setError({error: true, message: "Server error"})
        } else {
            setError({error: true, message: "An unexpected error has occurred"})
        }
    }
    loadData(userId)
}, [userId])

    //TODO: Add pagination, add method to view post detail (navigate or expand)
    // Better styling, loading indicator, error handling/message displays
    return (
        <div className="columns is-centered">
            <div className="column is-half">
                <h1 className={`title ${loading ? "has-skeleton" : ""}`}>{`${user?.username || user?.author}'s Posts`}</h1>
                {/*Displays a skeleton while loading */}
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div className="card is-skeleton" key={i} style={{marginTop: "10px", minHeight: 150}}/>
                    ))
                ) : posts?.length > 0 ? posts.map((post) => (
                    <Post post={post} edit={isAuthor} key={post.id} refresh={setPosts}/>
                )) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    )
}