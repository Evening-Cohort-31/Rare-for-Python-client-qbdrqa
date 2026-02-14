import { useEffect, useState } from "react"
import { getApprovedPublishedPosts } from "../managers/PostManager"
import { HumanDate } from "../components/utils/HumanDate"

export const PostsList = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getApprovedPublishedPosts().then(setPosts)
  }, [])

  return (
    <>
      <h1>Posts</h1>

      {posts.map(post => (
        <section key={`post--${post.id}`} className="post">
          <h2>{post.title}</h2>
          <div>By {post.author}</div>
          <div>Category: {post.category}</div>
          <div>Published: <HumanDate date={post.publication_date} /></div>
        </section>
      ))}
    </>
  )
}