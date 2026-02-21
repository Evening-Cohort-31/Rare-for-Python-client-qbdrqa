import { useEffect, useState } from "react"
import { getApprovedPublishedPosts, getPostByTag, searchPostsByTitle } from "../../managers/PostManager.js"
import { Post } from "./Post.jsx"
import { useLocation, useParams, useSearchParams } from "react-router-dom"

export const PostsList = () => {
  const [posts, setPosts] = useState([])
  const [searchParams] = useSearchParams()
  const params = useParams()
  const location = useLocation()

    const isTagRoute = !!params.tagId

  useEffect(() => {
    if (searchParams.has("title")) {
      if (location.state && location.state > 0) {
        setPosts(location.state)
      } else {
        searchPostsByTitle(searchParams.get("title")).then(({status, response}) => {
          if (status >=200 && status < 300)
            response.then(setPosts)
        })
      }

    }  else if (isTagRoute) {
      getPostByTag(params.tagId).then(({status, response}) => {
        if (status >=200 && status < 300) {
          response.then(setPosts)
        }
      })
    } else {
    getApprovedPublishedPosts().then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setPosts)
      } else {
        response.then(console.log)
        setPosts([])
      }
    })
    }
  }, [params, isTagRoute, location, searchParams])



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