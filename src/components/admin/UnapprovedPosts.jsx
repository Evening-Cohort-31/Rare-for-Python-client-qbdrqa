import { useEffect, useState } from "react"
import { approvePost, getUnapprovedPosts } from "../../managers/PostManager.js"

export const UnapprovedPosts = () => {
    const [error, setError] = useState({error: false, message: ""})
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        //Get unapproved posts.then setPosts(unapproved)
        getUnapprovedPosts().then(res => res.json().then(res => setPosts(res)))
    }, [])

    const handleApprove = (post) => {
        const postId = post.id
        setPosts(posts.map(post =>
            post.id === postId
                ? {...post, approved: true}
                : post
        ))
        approvePost(postId)
        getUnapprovedPosts().then(res => res.json().then(res => setPosts(res)))
    }

    //TODO: Implement either a delete post on denial, or add denied property to posts to
    // let users edit their posts for approval. 

    // Will remove the post form the local state, but will be reloaded when page reloads
    const handleDeny = (post) => {
        const postId = post.id
        setPosts(posts.filter(post => post.id !== postId))
    }
    return (
        <div className="columns is-centered">
            <div className="column is-one-third">
                <h1 className="title">Unapproved Posts</h1>
                {/*Displays a skeleton while loading */}
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div className="card is-skeleton" key={i} style={{marginTop: "10px", minHeight: 150}}/>
                    ))
                ) : posts.length > 0 ? posts.map((post) => (
                    <div className="card" key={post.id} style={{marginTop: "10px"}}>
                        <div className="card-image">
                            <figure className="image is-16by9">
                                <img src={post.image_url !== "" ? post.image_url : "https://cdn11.bigcommerce.com/s-3uewkq06zr/images/stencil/1280x1280/products/230/406/blue_b__05623.1492487362.png?c=2" }  alt="post header"/>
                            </figure>
                        </div>
                        <header className="card-header">
                            <p className="card-header-title">{post.title}</p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <p>{post.content}</p>
                                <p>By: {post?.user?.username}</p>
                                <p>Category: {post.category.label}</p>
                            </div>
                        </div>
                        <footer className="card-footer">
                            <button className="card-footer-item button is-success" onClick={() => handleApprove(post)}>Approve</button>
                            <button className="card-footer-item button is-danger" onClick={() => handleDeny(post)}>Deny</button>
                        </footer>
                    </div>
                )) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    )
}