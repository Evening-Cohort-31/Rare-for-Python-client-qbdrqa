import { useEffect, useState } from "react"
import { getHomePage } from "../../managers/UserManager.js"
import { MyPosts } from "../posts/MyPosts.jsx"
import { Post } from "../posts/Post.jsx"

export const HomePage = ({userId}) => {
    const [user, setUser] = useState()

    useEffect(() => {
        getHomePage(userId).then(({status, response}) => {
            if (status === 200) {
                response.then(setUser)
            }
        })
    }, [userId])

    return (
        user && 
        <div className="columns is-centered">
            <div className="column is-half">
                <div className="box">
                    <h2 className="title">My Subscriptions</h2>
                    <div  style={{overflowY: "scroll", maxHeight: "90vh"}}>
                        {user.subscribed_posts.map(post => (
                            <Post post={post} key={post.id} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="column is-half">
                <div className="box">
                    <h2 className="title">My Posts</h2>
                    <div  style={{overflowY: "scroll", maxHeight: "80vh"}}>
                        {user.posts.map(post => (
                            <Post post={post} key={post.id}/>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}