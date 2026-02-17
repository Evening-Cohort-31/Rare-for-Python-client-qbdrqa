import { useEffect, useState } from "react"
import { getApprovedPublishedPosts } from "../managers/PostManager"
<<<<<<< HEAD
import { Post } from "../components/posts/Post.jsx"
=======
import { HumanDate } from "../components/utils/HumanDate"
import { Link } from "react-router-dom"
>>>>>>> develop

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

<<<<<<< HEAD
      {posts.length > 0 && posts.map(post => (
        <Post post={post} key={post.id}/>
=======
      {posts.map(post => (
        <section key={`post--${post.id}`} className="post">
          <h2>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <div>By {post.author}</div>
          <div>Category: {post.category}</div>
          <div>Published: <HumanDate date={post.publication_date} /></div>
        </section>
>>>>>>> develop
      ))}
      </div>
    </div>
  )
}