import { MdEdit } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"

/**A card component for displaying PostData */
export const Post = ({ post, edit = false }) => {
    const navigate = useNavigate()

    return ( 
        <div className="card" style={{marginTop: "10px"}} onClick={() => {}}>
            <header className="card-header">
                <a className="card-header-title" href={`/post/${post.id}`}>
                {post.title}</a>
                {edit && 
                    <button className="card-header-icon" aria-label="edit post">
                        <span className="icon">
                            <MdEdit onClick={() => {
                                navigate(`/post/${post.id}?edit=true`)
                            }}/>
                        </span>
                    </button>}
            </header>
            <div className="card-content">
                <div className="content">
                    <p>By: {post.user?.username}</p>
                    <p>Category: {post.category.label}</p>
                    <div className="tags">
                        {post.tags.map(tag => (
                            <a className="tag is-primary" key={tag.id} href={`/posts/tags/${tag.id}`}>{tag.label}</a>
                        ))}
                    </div>
                    <div>Published: <HumanDate date={post.publication_date} /></div>
                </div>
            </div>
        </div>
    )
}