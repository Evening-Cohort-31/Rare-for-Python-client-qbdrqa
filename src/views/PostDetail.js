import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPostById } from "../managers/PostManager"
import { Post } from "../components/posts/Post.jsx"

export const PostDetail = () => {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {

    getPostById(postId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setPost)
      } else {
        response.then(console.log)
      }
    })
  }, [postId])

  useEffect(() => {
    post && setIsOwner(Number(localStorage.getItem("auth_token")) === post.user.id)
  }, [post])

  if (!post) return <p>Loading...</p>

  return (

    <div className="columns is-centered">
      <div className="column is-half is-centered">
        <Post post={post} detail edit={isOwner}/>
      </div>
    </div>
  )
}