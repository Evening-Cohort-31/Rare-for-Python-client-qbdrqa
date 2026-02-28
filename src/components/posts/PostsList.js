import { useEffect, useState } from "react"
import { getApprovedPublishedPosts, getPostByTag, getPostsByCategory, searchPostsByTitle } from "../../managers/PostManager.js"
import { Post } from "./Post.jsx"
import { useLocation, useParams, useSearchParams } from "react-router-dom"

export const PostsList = () => {
  const [posts, setPosts] = useState([])
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const location = useLocation()

  const isTagRoute = !!params.tagId
  const isCategoryRoute = !!params.category

  useEffect(() => {
    setLoading(true)
    if (searchParams.has("title")) {
      if (location.state && location.state > 0) {
        setLoading(false)
        setPosts(location.state)
      } else {
        searchPostsByTitle(searchParams.get("title")).then(({status, response}) => {
          setLoading(false)
          if (status >=200 && status < 300)
            response.then(setPosts)
        })
      }

    }  else if (isTagRoute) {
      getPostByTag(params.tagId).then(({status, response}) => {
        setLoading(false)
        if (status >=200 && status < 300) {
          response.then(setPosts)
        }
      })
    } else if (isCategoryRoute) {
      getPostsByCategory(params.category).then(({status, response}) => {
        setLoading(false)
        if (status >= 200 && status < 300) {
          response.then(setPosts)
        }
      })
    } else {
    getApprovedPublishedPosts().then(({ status, response }) => {
      setLoading(false)
      if (status >= 200 && status < 300) {
        response.then(setPosts)
      } else {
        response.then(console.log)
        setPosts([])
      }
    })
    }
  }, [params, isTagRoute, isCategoryRoute, location, searchParams])

  return (
    <div className="columns is-centered">
      <div className="column is-one-third">
      <h1 className="title">Posts</h1>
      {!loading ? 
        posts.length ? 
          posts.map(post => (
            <Post post={post} key={post.id}/>
          )) :
          <p>No posts found</p> 
        :
        Array.from({ length: 5 }).map((_, i) => (
          <div className="card is-skeleton" key={i} style={{marginTop: "10px", minHeight: 150}}/>
        ))}
      </div>
    </div>
  )
}