import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPostById } from "../managers/PostManager"

export const PostDetail = () => {
  const { postId } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    getPostById(postId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setPost)
      } else {
        response.then(console.log)
      }
    })
  }, [postId])

  if (!post) return <p>Loading...</p>

  return (
    <section className="post-detail">
      <h1>{post.title}</h1>

      {post.image_url ? (
        <img src={post.image_url} alt="Post header" style={{ maxWidth: "100%" }} />
      ) : null}

      <div><strong>By:</strong> {post.author_display_name}</div>

      <div>
        <strong>Published:</strong>{" "}
        {new Date(post.publication_date).toLocaleDateString("en-US")}
      </div>

      <hr />

      <div>{post.content}</div>
    </section>
  )
}