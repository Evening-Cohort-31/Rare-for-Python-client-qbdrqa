import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { createPost } from "../../managers/PostManager.js"

export const CreatePostForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({error: false, message:""});
    const categoryId = useRef()
    const title = useRef()
    const imageUrl = useRef()
    const content = useRef()
    const navigate = useNavigate()

    //TODO: Create a CategoryManager and getCategories function
    const categories = [{id: 1, label: "Life"}, {id: 2, label: "Work"}, {id: 3, label: "Hobby"}, {id: 4, label: "Fluff"}]

    const handleCreateNewPost = (e) => {
        setError({error: false, message: ""})
        e.preventDefault()
        setLoading(true)

        const newPost = {
            user_id: Number(localStorage.getItem("auth_token")),
            category_id: Number(categoryId.current.value),
            title: title.current.value,
            image_url: imageUrl.current.value,
            content: content.current.value,
            approved: true
        }
        createPost(newPost).then(async res => {
            setLoading(false)
            if (res.status === 201) {
                //TODO: Create Posts route/postDetails
                const response = await res.response
                navigate(`/post/${response.id}`, {state: response})
            } else if (res.status >=400 && res.status < 500) {
                setError({error: true, message: "Action not supported"})
            } else if (res.status >=500) {
                setError({error: true, message: "Server error - please try again"})
            } else {
                setError({error: true, message: "An unexpected error has occurred, please try again"})
            }
        }).catch(err => {
            setLoading(false)
            setError({error: true, message: "An unexpected error occurred"})
        }) 
        }

    const errorMessage = (
            <div className={`modal ${error.error ? "is-active" : ""}`}>
                <div className="modal-background" onClick={() => setError({error: false, message: ""})}></div>
                <div className="modal-content">
                    <div className="box">
                        <p>{error.message}</p>
                    </div>
                </div>
            </div>
    )


    return (
        <section className="columns is-centered">
            <form className="column is-two-thirds" onSubmit={handleCreateNewPost}>
            <h1 className="title">Rare Publishing</h1>
                <p className="subtitle">Create New Post</p>

                {error.error && errorMessage}

                <div className="field">
                    <label className="label">Title*</label>
                    <div className="control">
                        <input className="input" type="text" ref={title} required/>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Content*</label>
                    <div className="control">
                        <textarea className="textarea" placeholder="Add content here..." ref={content} required></textarea>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Category*</label>
                    <div className="control">
                        <div className="select">
                            <select ref={categoryId} required>
                                <option value="">Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Post Header Image</label>
                    <div className="control">
                        <input className="input" type="url" ref={imageUrl}></input>
                    </div>
                </div>

                <fieldset disabled={loading}>
                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-link" type="submit">Submit</button>
                    </div>
                    <div className="control">
                        <button type="button" className="button is-link is-light" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </div>
                </fieldset>
                <div className="help">
                    <p>* Indicates a required field</p>
                </div>

            </form>
        </section>
    )
}