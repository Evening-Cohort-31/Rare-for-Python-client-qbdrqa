import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getPostById } from "../../managers/PostManager.js"
import { Post } from "./Post.jsx"

export const PostDetail = () => {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [isOwner, setIsOwner] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getPostById(postId).then(({ status, response }) => {
      setLoading(false)
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

  useEffect(() => {
    isOwner === false && post && post.approved === 0 && navigate("/")
  },[isOwner, post, navigate])

  return (
    <div className="columns is-centered">
      <div className="column is-half is-centered">
        {
          loading 
            ? <div className="card is-skeleton" style={{marginTop: "10px", minHeight: 750, borderRadius: "10px"}}/>
            : post && <Post post={post} detail edit={isOwner}/>
        }
      </div>
    </div>
  )
}