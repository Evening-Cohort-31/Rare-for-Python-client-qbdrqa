import { useEffect, useState } from "react"
import { getHomePage, getUserById } from "../../managers/UserManager.js"
import { MyPosts } from "../posts/MyPosts.jsx"
import { Post } from "../posts/Post.jsx"
import { BiSearch, BiSearchAlt2 } from "react-icons/bi"
import { getApprovedPublishedPosts, getPostByUserId, getSubscribedPosts } from "../../managers/PostManager.js"

export const HomePage = ({userId}) => {
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])
    const [currentPanelTab, setCurrentPanelTab] = useState(0)

    useEffect(() => {
        getUserById(userId).then(({status, response}) => {
            if (status === 200) {
                response.then(setUser)
            }
        })
        panelTabs[currentPanelTab].method(userId).then(({status, response}) => {
            if (status === 200) {
                response.then(setPosts)
            }
        })
    }, [userId, currentPanelTab])

    const panelTabs = [{label: "All", method: getApprovedPublishedPosts}, {label: "My Posts", method: getPostByUserId}, {label: "Subscriptions", method: getSubscribedPosts}]

    //TODO: Add loading and error states/handling, add pagination, implement search functionality
    return (
        user && 
        <div className="columns is-centered">
        <article 
            className="panel column is-two-thirds mt-5"
        >
            <p className="panel-heading">{user.username}</p>
            {/* <div className="panel-block">
                <p className="control has-icons-left">
                    <input className="input" type="text" placeholder="Search" />
                    <span className="icon is-left">
                        <BiSearchAlt2 />
                    </span>
                </p>
            </div> */}
            <p className="panel-tabs">
                {panelTabs.map((tab, i) => (
                    <button
                        key={i} 
                        className={`${currentPanelTab === i ? "is-active has-text-gray" : "has-text-link"}`}
                        onClick={() => {setCurrentPanelTab(i)}}
                    >{tab.label}</button>
                ))}
            </p>
            <div className="panel-block columns is-centered">
                <div className="column is-half">
                    {posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </article>
        </div>
        // <div className="columns is-centered">
        //     <div className="column is-half">
        //         <div className="box">
        //             <h2 className="title">My Subscriptions</h2>
        //             <div  style={{overflowY: "scroll", maxHeight: "90vh"}}>
        //                 {user.subscribed_posts.map(post => (
        //                     <Post post={post} key={post.id} />
        //                 ))}
        //             </div>
        //         </div>
        //     </div>
        //     <div className="column is-half">
        //         <div className="box">
        //             <h2 className="title">My Posts</h2>
        //             <div  style={{overflowY: "scroll", maxHeight: "80vh"}}>
        //                 {user.posts.map(post => (
        //                     <Post post={post} key={post.id}/>
        //             ))}
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}