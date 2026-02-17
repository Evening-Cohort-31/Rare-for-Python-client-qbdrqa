import { useEffect, useState } from "react"
import { getApprovedPublishedPosts } from "../managers/PostManager"
import { HumanDate } from "../components/utils/HumanDate"
import { Link } from "react-router-dom"

export const PostsList = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getApprovedPublishedPosts().then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setPosts)
      } else {
        response.then(console.log)
        setPosts([])
      }
    })
  }, [])

  return (
    <>
      <h1>Posts</h1>

      {posts.map(post => (
        <section key={`post--${post.id}`} className="post">
          <h2>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <div>By {post.author}</div>
          <div>Category: {post.category}</div>
          <div>Published: <HumanDate date={post.publication_date} /></div>
        </section>
      ))}
    </>
  )
}