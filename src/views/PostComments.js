import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getCommentsByPostId } from "../managers/CommentManager"
import { getPostById } from "../managers/PostManager"

export const PostComments = () => {
  const { id } = useParams()
  const [comments, setComments] = useState([])
  const [post, setPost] = useState(null)

  useEffect(() => {
    getPostById(id).then(({ status, response }) => {
      if (status >= 200 && status < 300) response.then(setPost)
    })

    getCommentsByPostId(id).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setComments)
      } else {
        response.then(console.log)
        setComments([])
      }
    })
  }, [id])

  return (
    <>
      <h1>Comments</h1>

      {/* Post title at top */}
      <h2 style={{ marginTop: "0.5rem" }}>
        {post ? post.title : "Loading post..."}
      </h2>

      {/* Link back to post */}
      <div style={{ marginBottom: "1rem" }}>
        <Link to={`/post/${id}`}>Back to Post</Link>
        {"  |  "}
        <Link to={`/post/${id}/comments/new`}>Add Comment</Link>
      </div>

      {comments.map((c) => (
        <section key={`comment--${c.id}`} className="box">
          <div><strong>{c.subject}</strong></div>
          <div>{c.content}</div>
          <div>By {c.author}</div>
          <div style={{ fontSize: ".9rem", opacity: ".75" }}>
            {new Date(c.created_on).toLocaleDateString("en-US")}
          </div>
        </section>
      ))}
    </>
  )
}