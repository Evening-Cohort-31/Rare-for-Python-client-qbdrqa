import { useEffect, useState } from "react"
import { getHomePage } from "../../managers/UserManager.js"
import { MyPosts } from "../posts/MyPosts.jsx"
import { Post } from "../posts/Post.jsx"
import { BiSearch, BiSearchAlt2 } from "react-icons/bi"

export const HomePage = ({userId}) => {
    const [user, setUser] = useState()
    const [currentPanelTab, setCurrentPanelTab] = useState(0)

    useEffect(() => {
        getHomePage(userId).then(({status, response}) => {
            if (status === 200) {
                response.then(setUser)
            }
        })
    }, [userId])

    const panelTabs = ["All", "My Posts", "Subscriptions"]

    return (
        user && 
        <article className="panel">
            <p className="panel-heading">{user.username}</p>
            <div className="panel-block">
                <p className="control has-icons-left">
                    <input className="input" type="text" placeholder="Search" />
                    <span className="icon is-left">
                        <BiSearchAlt2 />
                    </span>
                </p>
            </div>
            <p className="panel-tabs">
                {panelTabs.map((tab, i) => (
                    <button
                        key={i} 
                        className={`${currentPanelTab === i ? "is-active has-text-gray" : "has-text-link"}`}
                        onClick={() => {setCurrentPanelTab(i)}}
                    >{tab}</button>
                ))}
            </p>
            <div className="panel-block">

            </div>
        </article>
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