import { useState, useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createPost, editPost, getPostById } from "../../managers/PostManager.js";
import { getAllTags } from "../../managers/TagManager.js";

// A form for letting users create or edit a post
export const PostForm = () => {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({error: false, message:""});
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category_id: "",
        tags: [],
        image_url: ""
    })
    
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const params = useParams()

    const postId = params.id
    const edit = Boolean(searchParams.get("edit"))

    const userId = Number(localStorage.getItem("auth_token"))

    //TODO: Create a CategoryManager and getCategories function
    const categories = [{id: 1, label: "Life"}, {id: 2, label: "Work"}, {id: 3, label: "Hobby"}, {id: 4, label: "Fluff"}]

    //Load form with post data if editing
    useEffect(() => {
        setLoading(true)
        getAllTags().then(async res => {
            setLoading(false)
            if (res.status === 200) {
                setTags(await res.response)
            } else if (res.status >= 400 && res.status < 500) {
                setError({error: true, message: "Action not supported"})
            } else if (res.status >= 500) {
                setError({error: true, message: "Server error"})
            } else {
                setError({error: true, message: "An unexpected error has occurred"})
            }
        })

        if (edit && postId) {
            getPostById(postId).then(async res => {
                setLoading(false)
                if (res.status === 200) {
                    const post = await res.response
                    if (post.user.id !== userId) {
                        // Routes to home page if user tries to edit another user's posts
                        //TODO: Need to add better handling for his, i.e. refuse to navigate to page at all
                        setError({error: true, message: "You do not have permission to edit this post"})
                        setTimeout(() => {
                            navigate("/")
                        }, 3000)
                        return
                    }
                    setFormData({
                        title: post.title,
                        content: post.content,
                        category_id: post.category.id,
                        image_url: post.image_url || "",
                        tags: post.tags?.map(tag => String(tag.id)) || []
                    })
                } else {
                    setError({error: true, message: "Error retrieving post information"})
                }
            })
        }
    }, [edit, postId, navigate, userId])

    // Updates existing post or creates new one
    const handleSubmitPost = (e) => {
        setError({error: false, message: ""})
        e.preventDefault()
        setLoading(true)

        const postDetails = {
            user_id: Number(localStorage.getItem("auth_token")),
            category_id: Number(formData.category_id),
            title: formData.title,
            image_url: formData.image_url,
            content: formData.content,
            tags: formData.tags,
            approved: true,
            ...(edit && { id: postId })
        };

        (edit && postDetails.user_id === userId ? editPost(postDetails) : createPost(postDetails)).then(async res => {
            setLoading(false)
            if (res.status >= 200 && res.status < 300) {
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

    // A modal to display error messages
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
            <form className="column is-two-thirds" onSubmit={handleSubmitPost}>
            <h1 className="title">Rare Publishing</h1>
                <p className="subtitle">{edit ? "Edit Post" : "Create New Post"}</p>

                {error.error && errorMessage}

                <div className="field">
                    <label className="label">Title*</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Content*</label>
                    <div className="control">
                        <textarea 
                            className="textarea" 
                            placeholder="Add content here..." 
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Category*</label>
                    <div className="control">
                        <div className="select">
                            <select 
                                value={formData.category_id}
                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                required
                            >
                                <option value="">Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Tags</label>
                    <div className="control">
                        <div className="select is-multiple">
                            <select
                                multiple
                                value={formData.tags}
                                onChange={(e) => {
                                    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({...formData, tags: selectedValues});
                                }}
                            >
                                <option value="">Select a Tag</option>
                                {tags.map(tag => (
                                    <option key={tag.id} value={String(tag.id)}>{tag.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="help">
                        <p>Multiple items can be selected by clicking while holding ctrl</p>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Post Header Image</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="url" 
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        />
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