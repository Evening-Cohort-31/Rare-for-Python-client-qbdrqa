import { MdEdit } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { useEffect, useMemo, useState } from "react"
import { getAllTags } from "../../managers/TagManager.js"
import { editPost, deletePost } from "../../managers/PostManager.js"
import { CommentForm } from "../../views/CommentForm.js"
import { BiUpArrow } from "react-icons/bi"
import { PostHeaderImage } from "../utils/PostHeaderImage.jsx"

export const Post = ({ post, edit = false, detail = false, approval=null }) => {
  
  const [showTagManager, setShowTagManager] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tagLimit, setTagLimit] = useState(10)
  const [allTags, setAllTags] = useState([])
  const [postTags, setPostTags] = useState(post?.tags ?? [])
  const navigate = useNavigate()
  const [loadingTags, setLoadingTags] = useState(false)
  const [addingComment, setAddingComment] = useState(false)
  const [viewingComments, setViewingComments] = useState(false)
  const [comments, setComments] = useState([])

  const safePostTags = useMemo(() => post?.tags ?? [], [post])

  useEffect(() => {
    setPostTags(safePostTags)
  }, [safePostTags])

  // useEffect(() => {
  //   if (viewingComments) {
  //     setLoadingComments(true)
  //     getCommentsByPostId(post.id).then(({status, response}) => {
  //       if (status >= 200 && status < 300) {
  //         response.then(setComments)
  //       }
  //     })
  //   }
  //   setLoadingComments(false)
  // },[post, viewingComments])

  useEffect(() => {
    setComments(post.comments)
  },[post])

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

  const handleComments = (newComment) => {
    if (!newComment) {
      setAddingComment(false)
      return
    }
    setComments(prev => [...prev, newComment])
    setAddingComment(false)
    setViewingComments(true)
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
            <PostHeaderImage src={`http://localhost:8000/posts?image=${post.id}&v=${post.updated_at}`}/>
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
          <div hidden={!viewingComments} className="pt-5">
            <div className="is-flex is-align-items-center pb-5">
              <h3 className="" style={{margin: 0}}>Comments</h3>
              <BiUpArrow className="button" style={{marginLeft: "auto"}} onClick={() => setViewingComments(false)}/>
            </div>
            <div style={{overflowY: "scroll", maxHeight: "300px"}} className="box comments-scroll">
              {comments.length > 0 && comments.slice(0,3).map(comment => (
                <article className="message is-small" key={comment.id}>
                  <div className="message-header">
                    <div className="column is-two-thirds">
                      <h3 className="hide-overflow">{comment.subject}</h3>
                      <button className="ml-3 has-text-link" onClick={() => {
                        navigate(`/users/${comment.author.id}`)
                      }}>{comment.author.username}</button>
                    </div>
                    <div className="column is-one-third">                  
                      <HumanDate date={comment.created_on}/>
                    </div>
                  </div>
                  <div className="message-body">
                    {comment.content}
                    
                  </div>
                </article>
              ))}
            {comments.length > 3 && 
            <div className="has-text-right">
              <button className="button is-text" style={{marginLeft: "auto"}} onClick={() => {navigate(`/post/${post.id}/comments`)}}>View More</button>
            </div>
            }
          </div>
          </div>
        </div>
        <div hidden={!addingComment}>
            <CommentForm onCommentAdded={handleComments} postId={post.id} />
        </div>
      </div>
      {approval 
      ?
      <footer className="card-footer">
          <button className="card-footer-item button is-success" onClick={() => approval.handleApprove(post)}>Approve</button>
          <button className="card-footer-item button is-danger" onClick={() => approval.handleDeny(post)}>Deny</button>
      </footer> 
      :
      <div className="card-footer">
        <button className="card-footer-item button has-text-success" onClick={() => setAddingComment(true)} disabled={post.approved === 0}>Add Comment</button>
        <button 
          className={`card-footer-item button ${comments.length > 0 ? 'has-text-info' : 'has-text-gray'}`} 
          onClick={() => comments.length > 0 && setViewingComments(!viewingComments)} 
          disabled={comments.length === 0}
        >
          {!viewingComments ? "View Comments" : "Hide Comments"}
        </button>
      </div>}
    </div>
  )
}