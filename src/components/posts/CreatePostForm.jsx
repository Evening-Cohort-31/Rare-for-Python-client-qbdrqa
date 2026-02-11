import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { createPost } from "../../managers/PostManager.js"

export const CreatePostForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({error: false, message:""});
    const userId = useRef()
    const categoryId = useRef()
    const title = useRef()
    const imageUrl = useRef()
    const content = useRef()
    const navigate = useNavigate()

    const handleCreateNewPost = (e) => {
        setError({error: false, message: ""})
        e.preventDefault()
        setLoading(true)

        const newPost = {
            user_id: userId.current.value(),
            category_id: categoryId.current.value(),
            title: title.current.value(),
            imageUrl: imageUrl.current.value(),
            content: content.current.value(),
            approved: true
        }
        createPost(newPost).then(res => {
            setLoading(false)
            if (res.status === 201) {
                //TODO: Create Posts route/postDetails
                navigate(`/post/${res.response.id}`, {state: res.response})
            } else if (res.status >=400 && res.status < 500) {
                setError({error: true, message: "Action not supported"})
            } else if (res.status >=500) {
                setError({error: true, message: "Server error - please try again"})
            } else {
                setError({error: true, message: "An unexpected error has occured, please try again"})
            }
        })
        }


    return (
        <>New Post Form: Coming Soon</>
    )
}