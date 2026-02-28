import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteComment, getCommentById } from "../managers/CommentManager"

export const CommentDetail = () => {
  const { postId, commentId } = useParams()
  const navigate = useNavigate()
  const [comment, setComment] = useState(null)

  useEffect(() => {
    getCommentById(commentId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setComment)
      } else {
        response.then(console.log)
      }
    })
  }, [commentId])

  const handleDelete = () => {
    const ok = window.confirm("Delete this comment?")
    if (!ok) {
      navigate(`/post/${postId}/comments`)
      return
    }

    deleteComment(commentId).then(({ status }) => {
      if (status === 204 || (status >= 200 && status < 300)) {
        navigate(`/post/${postId}/comments`)
      } else {
        console.log("Delete failed", status)
      }
    })
  }

  if (!comment) return <p>Loading...</p>

  return (
    <>
      <h1>Comment Details</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Link to={`/post/${postId}/comments`}>Back to Comments</Link>
        {"  |  "}
        <Link to={`/post/${postId}/comments/${commentId}/edit`}>Edit</Link>
      </div>

      <section className="box">
        <div><strong>{comment.author?.username ?? ""}</strong></div>
        <div style={{ fontWeight: 600 }}>{comment.subject}</div>
        <div>{comment.content}</div>
        <div style={{ fontSize: ".9rem", opacity: ".75" }}>
          {comment.created_on ? new Date(comment.created_on).toLocaleDateString("en-US") : ""}
        </div>

        <button
          className="button is-danger"
          style={{ marginTop: "1rem" }}
          onClick={handleDelete}
        >
          Delete
        </button>
      </section>
    </>
  )
}