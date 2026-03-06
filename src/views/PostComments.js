import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getCommentsByPostId, deleteComment } from "../managers/CommentManager"
import { getPostById } from "../managers/PostManager"
import { Post } from "../components/posts/Post.jsx"
import { MdAddComment } from "react-icons/md"
import { CommentForm } from "./CommentForm.js"

export const PostComments = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [post, setPost] = useState(null)
  const [addingComment, setAddingComment] = useState(false)

  const currentUserId = parseInt(localStorage.getItem("auth_token"))

  const load = () => {
    getPostById(postId, currentUserId).then(({ status, response }) => {
      if (status >= 200 && status < 300) response.then(setPost)
    })

    getCommentsByPostId(postId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then((data) => {
          const sorted = [...data].sort(
            (a, b) => new Date(b.created_on) - new Date(a.created_on)
          )
          setComments(sorted)
        })
      } else {
        response.then(console.log)
        setComments([])
      }
    })
  }

  useEffect(() => {
    load()
  }, [postId])

  const handleDelete = (commentId) => {
    const ok = window.confirm("Delete this comment?")
    if (!ok) return

    deleteComment(commentId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        load()
      } else {
        response.then(console.log)
      }
    })
  }

  const canEditDelete = (c) => {
    if (c.author_id) return c.author_id === currentUserId
    if (c.author?.id) return c.author.id === currentUserId
    return false
  }

  return (
    post && 
    <div className="columns is-centered">
      <div className="column is-half">
      <Post post={post} updatePost={setPost} detail comment/>
        <div className="box">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <h1 className="title is-size-4 mb-0">Comments</h1>
            <button 
              className="button is-success" 
              type="button"
              onClick={() => {
                setAddingComment(true)
              }}
              >
              <span className="icon">
                <MdAddComment />
              </span>
            </button>
          </div>
          {addingComment && <CommentForm postId={postId} onCommentAdded={(comment) => {
            if (!comment) {
              setAddingComment(false)
              return
            }
            setComments(prev => [comment, ...prev])
            setAddingComment(false)
          }}/>}
          {comments.map((c) => (
            <section key={`comment--${c.id}`} className="box">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{c.subject}</strong>
                </div>
                <div style={{ fontSize: ".9rem", opacity: ".75" }}>
                  {new Date(c.created_on).toLocaleDateString("en-US")}
                </div>
              </div>
              <div style={{ marginTop: ".5rem" }}>{c.content}</div>
              <div style={{ marginTop: ".5rem", opacity: ".85" }}>
                By {c.author?.username ?? c.author_display_name ?? "Unknown"}
              </div>
              <div className="buttons" style={{ marginTop: ".75rem" }}>
                <button
                  className="button is-small"
                  type="button"
                  onClick={() => navigate(`/post/${postId}/comments/${c.id}`)}
                >
                  View
                </button>
                {canEditDelete(c) && (
                  <>
                    <button
                      className="button is-small is-info"
                      type="button"
                      onClick={() => navigate(`/post/${postId}/comments/${c.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="button is-small is-danger"
                      type="button"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}