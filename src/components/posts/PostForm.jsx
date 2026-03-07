import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { createPost, editPost, getPostById } from "../../managers/PostManager.js";
import { getAllTags } from "../../managers/TagManager.js";
import { IsAdmin } from "../utils/IsAdmin.js";
import { getCategories } from "../../managers/CategoryManager.js";
import { DragDrop } from "../utils/DragDrop.jsx";

// A form for letting users create or edit a post
export const PostForm = ({edit = false}) => {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([])
    const [error, setError] = useState({error: false, message:""});
    const [postHeaderImage, setPostHeaderImage] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category_id: "",
        tags: [],
        image: null
    })
    
    const navigate = useNavigate()
    const params = useParams()

    const postId = params.postId

    const userId = Number(localStorage.getItem("auth_token"))

    // Load categories and tags on mount
    useEffect(() => {
        setLoading(true)
        
        const loadFormData = async () => {
            try {
                const [categoriesRes, tagsRes] = await Promise.all([
                    getCategories(),
                    getAllTags()
                ]);
                
                setCategories(await categoriesRes.response);
                
                if (tagsRes.status === 200) {
                    setTags(await tagsRes.response);
                } else if (tagsRes.status >= 400 && tagsRes.status < 500) {
                    setError({error: true, message: "Action not supported"});
                } else if (tagsRes.status >= 500) {
                    setError({error: true, message: "Server error"});
                } else {
                    setError({error: true, message: "An unexpected error has occurred"});
                }
            } catch (err) {
                setError({error: true, message: "Failed to load form data"});
            } finally {
                setLoading(false);
            }
        };
        
        loadFormData();
    }, []);

    // Load post data when editing
    useEffect(() => {
        if (edit && postId) {
            setLoading(true);
            
            getPostById(postId, userId).then(async res => {
                setLoading(false);
                
                if (res.status === 200) {
                    const post = await res.response;
                    
                    if (post.user.id !== userId) {
                        // Routes to home page if user tries to edit another user's posts
                        //TODO: Need to add better handling for this, i.e. refuse to navigate to page at all
                        setError({error: true, message: "You do not have permission to edit this post"});
                        setTimeout(() => {
                            navigate("/");
                        }, 3000);
                        return;
                    }
                    
                    setFormData({
                        title: post.title,
                        content: post.content,
                        category_id: post.category.id,
                        image: postHeaderImage,
                        tags: post.tags?.map(tag => String(tag.id)) || [],
                        status: post.status
                    });
                } else {
                    setError({error: true, message: "Error retrieving post information"});
                }
            }).catch(err => {
                setLoading(false);
                setError({error: true, message: "Failed to load post data"});
            });
        }
    }, [edit, postId, navigate, userId, postHeaderImage]);

    // Updates existing post or creates new one
    const handleSubmitPost = async (e, save=false) => {
        setError({error: false, message: ""})
        e.preventDefault()
        setLoading(true)

        // Determine status based on save flag and user type
        let status = edit ? formData.status : "draft";
        if (!save) {
            const isAdmin = await IsAdmin(userId);
            status = isAdmin ? "approved" : "submitted";
        } else {
            status = "draft"
        }

        const postDetails = {
            user_id: Number(localStorage.getItem("auth_token")),
            category_id: Number(formData.category_id),
            title: formData.title,
            image: postHeaderImage,
            content: formData.content,
            tags: formData.tags,
            status: status,
            ...(edit && { id: postId })
        };

        (edit && postDetails.user_id === userId ? editPost(postDetails, save) : createPost(postDetails)).then(async res => {
            setLoading(false)
            if (res.status >= 200 && res.status < 300) {
                const response = await res.response
                !edit ? navigate(`/post/${response.id}`, {state: response})
                : navigate(-1, {state: response})
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
                        <div className={`select ${loading ? "is-loading" : ""}`}>
                            <select 
                                value={formData.category_id}
                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                required
                            >
                                <option value="">Select a Category</option>
                                {categories && categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Tags</label>
                    <div className="control">
                        <div className={`select is-multiple comments-scroll ${loading ? "is-loading" : ""}`}>
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
                        <DragDrop setImage={setPostHeaderImage}/>
                    </div>
                </div>

                <fieldset disabled={loading}>
                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-success" type="submit">Submit</button>
                    </div>
                    <div className="control">
                        <button className="button is-link" onClick={(e) => {
                            handleSubmitPost(e, true)
                        }}>Save</button>
                    </div>
                    <div className="control">
                        <button type="button" className="button is-link is-light" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </div>
                </fieldset>
                <div className="help">
                    <p>* Indicates a required field</p>
                    <p>Saving will store current post in your drafts</p>
                </div>

            </form>
        </section> 
    )
}