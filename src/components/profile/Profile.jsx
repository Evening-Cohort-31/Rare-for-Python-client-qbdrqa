import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { addSubscription, getUserById, removeSubscription } from "../../managers/UserManager.js"
import { HumanDate } from "../utils/HumanDate.js"
import { MyPosts } from "../posts/MyPosts.jsx"
import { ProfileImage } from "../utils/ProfileImage.jsx"

export const Profile = () => {
    const [user, setUser] = useState()
    const {userId} = useParams()

    const navigate = useNavigate()
    const token = localStorage.getItem("auth_token")

    useEffect(() => {
        getUserById(userId).then(({status, response}) => {
            if (status === 200) {
                response.then(res => {
                    if (res?.active) setUser(res)
                    else navigate("/")
                    })
            }
    })
    }, [userId, navigate])

    return (
        user?.active ?
        <div className="container is-flex is-flex-direction-column is-justify-content-center">
            <div className="columns is-centered">
                <div className="column is-half">
                    <div className="is-flex is-align-items-center">
                        <h1 className={`title`} style={{margin: 0}}>{user?.username}'s Profile</h1>
                        <figure className="image is-48x48 ml-5">
                            <ProfileImage src={user.profile_image_url}/>
                        </figure>
                    </div>
                    <div className="is-column is-half">
                        <h2 className="is-size-4" style={{margin:0}}>{user?.first_name + " " + user?.last_name}</h2>
                        {user.id !== Number(token) ? 
                            user.subscribers.find(s => s.id === Number(token)) 
                            ? (
                                <button 
                                    className="button is-danger is-small" 
                                    onClick={() => {
                                        removeSubscription(token, userId).then(({status, response}) => {
                                            if (status === 200) {
                                                response.then(res => {
                                                    if (res.deleted) {
                                                        setUser({...user, subscribers: user.subscribers.filter(s => s.id !== Number(token))})
                                                    }
                                                })
                                            }
                                        })
                                        
                                    }}>Unsubscribe</button>
                            )
                            : (
                            <button 
                                className="button is-success is-small" 
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
                        <div className="block ml-4">
                            <p>{`${user?.type}`}</p>
                            <p>{user.subscriber_count} Subscribers</p>
                            <p>{user?.email}</p>
                            <p>Member since <HumanDate date={user?.created_on}/></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box px-0">
                <MyPosts />
            </div>
        </div>
        : <>Loading</>
    )
}