import { useEffect, useState } from "react"
import { getApprovedPublishedPosts, getPostByTag } from "../../managers/PostManager.js"
import { Post } from "./Post.jsx"
import { useParams } from "react-router-dom"

export const PostsList = () => {
  const [posts, setPosts] = useState([])
  const params = useParams()

  const isTagRoute = !!params.tagId

  useEffect(() => {
    isTagRoute ? 
      getPostByTag(params.tagId).then(({status, response}) => {
        if (status >=200 && status < 300) {
          response.then(setPosts)
        }
      })
    :
    getApprovedPublishedPosts().then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setPosts)
      } else {
        response.then(console.log)
        setPosts([])
      }
    })
  }, [params, isTagRoute])



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