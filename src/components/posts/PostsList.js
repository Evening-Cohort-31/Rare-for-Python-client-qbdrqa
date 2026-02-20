import { useEffect, useState } from "react"
import { getApprovedPublishedPosts } from "../../managers/PostManager.js"
import { Post } from "./Post.jsx"

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