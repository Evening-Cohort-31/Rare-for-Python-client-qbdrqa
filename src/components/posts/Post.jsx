import { MdEdit } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { useEffect, useState } from "react"
import { getAllTags } from "../../managers/TagManager.js"
import { editPost } from "../../managers/PostManager.js"

/**A card component for displaying PostData */
export const Post = ({ post, edit = false, detail = false }) => {
    const [showTagManager, setShowTagManager] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [tagLimit, setTagLimit] = useState(10)
    const [allTags, setAllTags] = useState([])
    const [postTags, setPostTags] = useState(post.tags)
    const navigate = useNavigate()

    const handleAddTag = (e) => {
        const newTag = allTags.find(t => t.id === Number(e.target.value))
        setPostTags([...postTags, newTag])
        const updatedPost = {...post, tags: [...post.tags, newTag] }
        setAllTags(allTags.filter(t => t.id !== newTag.id))
        editPost(updatedPost)
    }

    const handleRemoveTag = (e) => {
        const toBeRemoved = postTags.find(t => t.id === Number(e.target.value))
        setAllTags([...allTags, toBeRemoved])
        const filteredOut = postTags.filter(t => t.id !== toBeRemoved.id)
        setPostTags(filteredOut)
        editPost({...post, tags: filteredOut})
    }

    useEffect(() => {
        getAllTags().then(res => res.response.then((res) => {
            const filterCurrentTags = res.filter(tag => 
                !post.tags.map(ptag => 
                    ptag.id
            ).includes(tag.id)
            )
            setAllTags(filterCurrentTags)}))

    }, [post, searchTerm])

    const tagManager = (
        <div className="message is-info">
            <div className="message is-info">
                <div className="message-header">
                <p>Manage Tags</p>
                <button className="delete" onClick={() => {            
                    setShowTagManager(false)
                    setSearchTerm("")
                    }}></button>
                </div>
                <div className="message-body">
                <div className="field">
                    <div className="control">
                    <input 
                        className="input" 
                        type="text" 
                        placeholder="Search tags..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                </div>
                {allTags.length > 0 && (
                    <div className="tags">
                        {
                        allTags.filter(t => t.label.toLowerCase().includes(searchTerm.toLowerCase())).slice(0,tagLimit).map((tag) => (
                            <button className="tag is-info" key={tag.id} value={tag.id} onClick={handleAddTag}>{tag.label}</button>
                        ))
                        }
                        {allTags.length > tagLimit && <button className="tag" onClick={() => setTagLimit(20)}>...</button>}
                    </div>
                )}
                </div>
            </div>
        </div>
    )

    return ( 
        <div className="card" style={{marginTop: "10px"}} onClick={() => {}}>
            {detail && (
                <div className="card-image">
                    <figure className="image is-16by9">
                        <img src={post.image_url !== "" ? post.image_url : "https://cdn11.bigcommerce.com/s-3uewkq06zr/images/stencil/1280x1280/products/230/406/blue_b__05623.1492487362.png?c=2"} alt="post header" />
                    </figure>

                </div>
            )}
            <header className="card-header">
                <a 
                    className="card-header-title mb-0 is-size-4"
                    href={`/post/${post.id}`}
                    style={{}}    
                >
                {post.title}</a>
                {
                edit && 
                    <button className="card-header-icon" aria-label="edit post">
                        <span className="icon">
                            <MdEdit onClick={() => {
                                navigate(`/post/edit/${post.id}`)
                            }}/>
                        </span>
                    </button>
                }
            </header>
            <div className="card-content pt-0">
                <div className="content">
                    {detail && (
                        <div style={{marginBlock: 10}}>{post.content}</div>
                    )}
                    <div>
                        <div><strong>By: </strong>{post.user?.username}</div>
                        <div><strong>Category: </strong>{post.category.label}</div>
                    </div>
                    <div style={{marginBlock: 10}} className="tags">
                        {postTags.map(tag => !showTagManager ? 
                                (
                                    <a className="tag is-primary" key={tag.id} href={`/posts/tags/${tag.id}`}>{tag.label}</a>
                                )
                                : 
                                (
                                    <div className="tags has-addons mb-4" key={tag.id}>
                                        <span className="tag is-primary">{tag.label}</span>
                                        <button className="tag is-delete" value={tag.id} onClick={handleRemoveTag}></button>
                                    </div>
                                )
                            )
                            }
                        {
                        edit && !showTagManager &&  
                        <button 
                            className="tag is-link" 
                            style={{}}
                            onClick={() => 
                                setShowTagManager(true)
                            }    
                        >
                        Manage Tags
                        </button> }
                    </div>
                    {showTagManager && tagManager}
                    <strong>Published: </strong><HumanDate date={post.publication_date}/>
                </div>
            </div>
        </div>
    )
}