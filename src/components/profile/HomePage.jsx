import { useEffect, useState } from "react"
import { getUserById } from "../../managers/UserManager.js"
import { Post } from "../posts/Post.jsx"
import { BiSearchAlt2 } from "react-icons/bi"
import { getApprovedPublishedPosts, getPostByUserId, getSubscribedPosts } from "../../managers/PostManager.js"

const panelTabs = [{label: "All", method: getApprovedPublishedPosts}, {label: "My Posts", method: getPostByUserId}, {label: "Subscriptions", method: getSubscribedPosts}]

export const HomePage = ({userId}) => {
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])
    const [displayedPosts, setDisplayedPosts] = useState([])
    const [currentPanelTab, setCurrentPanelTab] = useState(0)
    const [currentMenuTab, setCurrentMenuTab] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)
        getUserById(userId).then(({status, response}) => {
            setLoading(false)
            if (status === 200) {
                response.then(setUser)
            }
        })
    }, [userId])

    useEffect(() => {
        setLoading(true)
        panelTabs[currentPanelTab].method(userId).then(({status, response}) => {
            setLoading(false)
            if (status === 200) {
                response.then((res) => {
                    setPosts(res)
                    setDisplayedPosts(res)
            })
            }
        })
    }, [currentPanelTab, userId])

    const filterPosts = (subscriptionId) => {
        let filteredPosts = posts
        filteredPosts = posts.filter(post => 
            post.user.id === subscriptionId
        )        
        return filteredPosts
    }

    //TODO: Add error states/handling, add pagination
    return (
        user && 
        <div className="columns is-centered">
        <article 
            className="panel column is-two-thirds mt-5 is-primary"
        >
            <p className="panel-heading">{user.username}</p>
            <p className="panel-tabs">
                {panelTabs.map((tab, i) => (
                    <button
                        key={i} 
                        className={`${currentPanelTab === i ? "is-active has-text-gray" : "has-text-info"}`}
                        onClick={() => {setCurrentPanelTab(i)}}
                    >{tab.label}</button>
                ))}
            </p>
            <div className="panel-block">
                <p className="control has-icons-left">
                    <input 
                        className="input" 
                        type="text" 
                        placeholder="Search" 
                        value={searchTerm} 
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}
                    />
                    <span className="icon is-left">
                        <BiSearchAlt2 />
                    </span>
                </p>
            </div>
            <div className="panel-block columns is-centered">
                <div className="column is-narrow" style={{marginBottom: "auto", marginTop: 15}}>
                    <aside className="menu">
                        {currentPanelTab === 2 && 
                        <>
                            <p className="menu-label">Subscriptions</p>
                            <ul className="menu-list">
                                <li>
                                    <button 
                                        className={`${currentMenuTab === 0 ? "is-active" : ""}`} 
                                        onClick={() => {
                                            setCurrentMenuTab(0)
                                            setDisplayedPosts(posts)
                                        }}
                                        >All
                                    </button>
                                </li>
                                {user.subscriptions.map((sub, i) => (
                                    <li key={sub.id}>
                                        <button
                                            className={`${i + 1 === currentMenuTab ? "is-active" : ""}`} 
                                            onClick={() => {
                                                setLoading(true)
                                                setCurrentMenuTab(i + 1)
                                                setDisplayedPosts(filterPosts(sub.id))
                                                setLoading(false)
                                            }}
                                        >
                                            {sub.username}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                        }
                    </aside>
                </div>
                <div className="column">
                    {!loading ? displayedPosts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(post => (
                        <Post key={post.id} post={post} edit={post.user.id === Number(userId)} />
                    )) : (Array.from({ length: 5 }).map((_, i)=> (
                        <div className="card is-skeleton" key={i} style={{marginTop: "10px", minHeight: 150}}/>
                    )))}
                </div>
            </div>
        </article>
        </div>
    )
}