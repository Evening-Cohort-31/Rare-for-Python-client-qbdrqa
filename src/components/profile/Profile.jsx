import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { addSubscription, getUserById, removeSubscription } from "../../managers/UserManager.js"
import { HumanDate } from "../utils/HumanDate.js"
import { MyPosts } from "../posts/MyPosts.jsx"
import { ProfileImage } from "../utils/ProfileImage.jsx"

export const Profile = () => {
    const [user, setUser] = useState()
    const {userId} = useParams()
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const token = localStorage.getItem("auth_token")

    useEffect(() => {
        setLoading(true)
        getUserById(userId).then(({status, response}) => {
            setLoading(false)
            if (status === 200) {
                response.then(res => {
                    if (res?.active) setUser(res)
                    else navigate("/")
                })
        }
    })
    }, [userId, navigate])

    return (
        <div className="container is-flex is-flex-direction-column" style={{ minHeight: "90vh" }}>
            {!loading ? user && 
            <div className="columns is-centered">
                <div className="column is-narrow">
                    <figure className={`image is-96x96 mr-5`}>
                        <ProfileImage src={`http://localhost:8000/users?image=${user.id}`}/>
                    </figure>
                </div>
                <div className="column">
                    <div className={`is-flex`} style={{alignItems: "center"}}>
                        <h1 className={`title mb-1`}>{user?.username}</h1>
                        <p className="ml-2 is-capitalized">{`${user?.type}`}</p>
                        {user.id !== Number(token) ? 
                            user.subscribers.find(s => s.id === Number(token)) 
                            ? (
                                <button 
                                    className="button is-danger is-small ml-2 is-rounded" 
                                    onClick={(e) => {
                                        e.target.classList.add("is-loading")
                                        removeSubscription(token, userId).then(({status, response}) => {
                                            if (status === 200) {
                                                response.then(res => {
                                                    if (res.deleted) {
                                                        setUser({...user, subscribers: user.subscribers.filter(s => s.id !== Number(token))})
                                                            e.target.classList.remove("is-loading")
                                                    }
                                                })
                                            }
                                        })
                                        
                                    }}>Unsubscribe</button>
                            )
                            : (
                            <button 
                                className="button is-success is-small ml-2 is-rounded" 
                                onClick={() => addSubscription(token, userId).then(({status, response}) => {
                                    if (status === 201) {
                                        response.then(res => {
                                            setUser({...user, subscribers: [...user.subscribers, res]}) 
                                        })
                                        
                                    }
                                })}
                            >Subscribe</button>
                            )
                            : <></>
                        }

                    </div>
                    <div className="is-column is-half">
                        <strong>{user?.email}</strong><span className="ml-2">• {user.subscriber_count} Subscribers</span><span className="ml-2">• Member since <HumanDate date={user?.created_on}/></span>
                        <div className="block">
                            {user.first_name + " " + user.last_name + ": "}
                            {user.bio}
                        </div>
                    </div>
                </div>
            </div> 
            : 
            <div className="skeleton-block" style={{height: 120}}>
            </div>
            }
            <div className="box px-0 comments-scroll" style={{overflowY: "auto", height: "75vh", overflowX: "hidden", flexGrow: 1, minHeight: 0}}>
                <MyPosts />
            </div>
        </div>

    )
}