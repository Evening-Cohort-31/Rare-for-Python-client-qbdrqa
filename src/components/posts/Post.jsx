import { MdEdit } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { useEffect, useMemo, useState } from "react"
import { getAllTags } from "../../managers/TagManager.js"
import { editPost, deletePost } from "../../managers/PostManager.js"

export const Post = ({ post, edit = false, detail = false }) => {
  const [showTagManager, setShowTagManager] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tagLimit, setTagLimit] = useState(10)
  const [allTags, setAllTags] = useState([])
  const [postTags, setPostTags] = useState(post?.tags ?? [])
  const navigate = useNavigate()
  const [loadingTags, setLoadingTags] = useState(false)

  const safePostTags = useMemo(() => post?.tags ?? [], [post])

  useEffect(() => {
    setPostTags(safePostTags)
  }, [safePostTags])

  const handleAddTag = (e) => {
    const newTag = allTags.find((t) => t.id === Number(e.target.value))
    if (!newTag) return

    const nextTags = [...postTags, newTag]
    setPostTags(nextTags)
    setAllTags(allTags.filter((t) => t.id !== newTag.id))

    const updatedPost = { ...post, tags: nextTags }
    editPost(updatedPost)
  }

  const handleRemoveTag = (e) => {
    const toBeRemoved = postTags.find((t) => t.id === Number(e.target.value))
    if (!toBeRemoved) return

    const filteredOut = postTags.filter((t) => t.id !== toBeRemoved.id)
    setPostTags(filteredOut)
    setAllTags([...allTags, toBeRemoved])

    editPost({ ...post, tags: filteredOut })
  }

useEffect(() => {
        if (showTagManager) {
            getAllTags().then(res => res.response.then((res) => {
                const filterCurrentTags = res.filter(tag => 
                    !postTags.map(ptag => ptag.id).includes(tag.id)
                )
                setLoadingTags(false)
                setAllTags(filterCurrentTags)
            }))
        }
    }, [showTagManager, postTags])

  const tagManager = (
    <div className="message is-info">
      <div className="message is-info">
        <div className="message-header">
          <p>Manage Tags</p>
          <button
            className="delete"
            onClick={() => {
              setShowTagManager(false)
              setSearchTerm("")
            }}
          ></button>
        </div>
        <div className="message-body">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="tags">
              {allTags
                .filter((t) => t.label.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, tagLimit)
                .map((tag) => (
                  <button
                    className="tag is-info"
                    key={tag.id}
                    value={tag.id}
                    onClick={handleAddTag}
                  >
                    {tag.label}
                  </button>
                ))}

              {allTags.length > tagLimit && (
                <button className="tag" onClick={() => setTagLimit(20)}>
                  ...
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="card" style={{ marginTop: "10px" }}>
      {detail && (
        <div className="card-image">
          <figure className="image is-16by9">
            <img
              src={
                post?.image_url
                  ? post.image_url
                  : "https://cdn11.bigcommerce.com/s-3uewkq06zr/images/stencil/1280x1280/products/230/406/blue_b__05623.1492487362.png?c=2"
              }
              alt="post header"
            />
          </figure>
        </div>
      )}

      <header className="card-header">
        <Link className="card-header-title mb-0 is-size-4" to={`/post/${post.id}`}>
          {post.title}
        </Link>

        {edit && (
          <button className="card-header-icon" aria-label="edit post">
            <span className="icon">
              <MdEdit
                onClick={() => {
                  navigate(`/post/${post.id}?edit=true`)
                }}
              />
            </span>
          </button>
        )}

        {edit && (
          <button
            className="card-header-icon has-text-danger"
            aria-label="delete post"
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to delete this post?")
              if (confirmed) {
                deletePost(post.id).then(() => {
                  navigate("/")
                })
              }
            }}
          >
            🗑️ Delete
          </button>
        )}


      </header>

      <div className="card-content pt-0">
        <div className="content">
          {detail && <div style={{ marginBlock: 10 }}>{post?.content}</div>}

          <div>
            <div>
              <strong>By: </strong>
              <Link to={`/users/${post.user.id}`} className="has-text-primary">{post.user.username || post.user.author}</Link>
            </div>
            <div>
              <strong>Category: </strong>
              {post?.category?.label ?? post?.category ?? ""}
            </div>
          </div>

          <div style={{ marginBlock: 10 }} className="tags">
            {(postTags ?? []).map((tag) =>
              !showTagManager ? (
                <a className="tag is-primary" key={tag.id} href={`/posts/tags/${tag.id}`}>
                  {tag.label}
                </a>
              ) : (
                <div className="tags has-addons mb-4" key={tag.id}>
                  <span className="tag is-primary">{tag.label}</span>
                  {!loadingTags && <button
                    className="tag is-delete"
                    value={tag.id}
                    onClick={handleRemoveTag}
                  ></button>}
                </div>
              )
            )}

            {edit && !showTagManager && (
              <button 
                className="tag is-link" 
                onClick={() => { 
                  setLoadingTags(true)
                  setShowTagManager(true)}}>
                Manage Tags
              </button>
            )}
          </div>

          {showTagManager && !loadingTags && tagManager}

          <strong>Published: </strong>
          <HumanDate date={post?.publication_date} />
        </div>
      </div>
    </div>
  )
}