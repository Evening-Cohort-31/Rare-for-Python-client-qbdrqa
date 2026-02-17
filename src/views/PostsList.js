import { useEffect, useState } from "react"
import { getApprovedPublishedPosts } from "../managers/PostManager"
import { Post } from "../components/posts/Post.jsx"

export const PostsList = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getApprovedPublishedPosts().then(setPosts)
  }, [])

  return (
    <div className="columns is-centered">
      <div className="column is-one-third">
      <h1 className="title">Posts</h1>

      {posts.length > 0 && posts.map(post => (
        <Post post={post} key={post.id}/>
      ))}
      </div>
    </div>
  )
}