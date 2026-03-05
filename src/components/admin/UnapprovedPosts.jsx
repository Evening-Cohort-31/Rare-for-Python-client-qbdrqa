import { useEffect, useState } from "react"
import { approvePost, denyPost, getUnapprovedPosts } from "../../managers/PostManager.js"
import { Post } from "../posts/Post.jsx"

export const UnapprovedPosts = () => {
    const [error, setError] = useState({error: false, message: ""})
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState(Number(localStorage.getItem("auth_token")))
    
    useEffect(() => {
        setLoading(true)
        getUnapprovedPosts().then(({status, response}) => 
            {if (status === 200) {
                response.then(setPosts)
                setLoading(false)
            }})
    }, [])

    const handleApprove = (post) => {
        const postId = post.id
        setLoading(true)
        approvePost(postId, user)
            .then(({status, response}) => 
            {
                if (status === 200) {    
                    response.then(res => {
                        setPosts(posts.filter(p => p.id !== res.id))
                        setLoading(false)
                    })}}        
        )
            .catch(err => {
                setError({error: true, message: "Failed to approve post"})
                setLoading(false)
            })
    }

    const handleDeny = (post, comments="") => {
        const postId = post.id
        setPosts(posts.filter(post => post.id !== postId))
        denyPost(postId, user, comments)
    }

    const approval = {
        handleDeny: handleDeny,
        handleApprove: handleApprove,

    }

    return (
        <div className="columns is-centered">
            <div className="column is-half">
                <h1 className="title">Unapproved Posts</h1>
                {/*Displays a skeleton while loading */}
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div className="card is-skeleton" key={i} style={{marginTop: "10px", minHeight: 150}}/>
                    ))
                ) : posts.length > 0 ? posts.map((post) => (
                    <Post post={post} key={post.id} detail approval={approval}/>
                )) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    )
}