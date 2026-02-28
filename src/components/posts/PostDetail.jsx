import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getPostById } from "../../managers/PostManager"

export const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    getPostById(id).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then((data) => {
          setPost(data)
        })
      } else {
        setPost(null)
      }
    })
  }, [id])

  // Prevent rendering until post exists AND has an id
  if (!post?.id) {
    return <p>Loading...</p>
  }

  return (
    <>
      <h1>{post.title}</h1>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post header"
          style={{ maxWidth: "100%" }}
        />
      )}

      <div><strong>By:</strong> {post.author_display_name}</div>

      <div>
        <strong>Published:</strong>{" "}
        {new Date(post.publication_date).toLocaleDateString("en-US")}
      </div>

      <hr />

      <div>{post.content}</div>

      <div style={{ marginTop: "1rem" }}>
        <Link to={`/post/${post.id}/comments/new`}>
          Add Comment
        </Link>

        {" | "}

        <Link to={`/post/${post.id}/comments`}>
          View Comments
        </Link>
      </div>
    </>
  )
}