import { MdDelete, MdEdit } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { useEffect, useMemo, useState } from "react"
import { getAllTags } from "../../managers/TagManager.js"
import { editPost, deletePost, unapprovePost,addReaction, getPostById, removeReaction, submitPost  } from "../../managers/PostManager.js"
import { CommentForm } from "../../views/CommentForm.js"
import { BiUpArrow } from "react-icons/bi"
import { PostHeaderImage } from "../utils/PostHeaderImage.jsx"
import { deleteComment } from "../../managers/CommentManager.js"

export const Post = ({ post, edit = false, detail = false, approval=null, updatePost=null, admin=false, refresh=null, comment=false}) => {
  
  const [showTagManager, setShowTagManager] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tagLimit, setTagLimit] = useState(10)
  const [allTags, setAllTags] = useState([])
  const [postTags, setPostTags] = useState(post?.tags ?? [])
  const navigate = useNavigate()
  const [loadingTags, setLoadingTags] = useState(false)
  const currentUserId = Number(localStorage.getItem("auth_token"))
  const [userReactions, setUserReactions] = useState([])
  const [viewModal, setViewModal] = useState(false)
  const [adminComments, setAdminComments] = useState("")
  const [viewCommentModal, setViewCommentModal] = useState(false)

  const handleReaction = (reactionId) => {
    addReaction(post.id, currentUserId, reactionId).then(() => {
      getPostById(post.id, currentUserId).then(({ status, response }) => {
        if (status >= 200 && status < 300) {
          response.then((updatedPost) => {
            updatePost(updatedPost)
          })
        }
      })
    })
  }

  const handleRemoveReaction = (postReactionId) => {
    removeReaction(postReactionId).then(({status, response}) => {
      if (status === 200) {
        response.then(res => {
          const removedReaction = post.reactions.find(r => r.id === postReactionId)
          updatePost(prev => {
            return {...prev, reactions: prev.reactions.filter(r => r.id !== postReactionId), reaction_counts: prev.reaction_counts.map(rc => {
              if (rc.reaction_id === removedReaction.reaction.id) {
                return {...rc, count: rc.count -= 1}
              } else {
                return rc
              }
            })}
          })
          setUserReactions(prev =>
            prev.filter(r => r.reaction.id !== removedReaction.reaction.id)
           )
        })
      }
    })
  }


  const [addingComment, setAddingComment] = useState(false)
  const [viewingComments, setViewingComments] = useState(false)
  const [comments, setComments] = useState([])

  const safePostTags = useMemo(() => post?.tags ?? [], [post])

  useEffect(() => {
    setPostTags(safePostTags)
  }, [safePostTags])

  useEffect(() => {
    setComments(post.comments)
    setUserReactions(post.reactions.filter(pr => pr.user.id === currentUserId))
  },[post, currentUserId])

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

  const handleUnapprove = (postId, comments) => {
    unapprovePost(postId, currentUserId, comments).then(({status, response}) => {
      if (status === 200) {
        response.then(post => updatePost(post))
      }
    })
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
      <div className={`modal ${viewModal ? "is-active" : ""}`}>
        <div 
          className="modal-background"
          onClick={() => setViewModal(false)}
        />
        <div className="modal-content">
          <div className="box">
            <div className="field">
              <label className="label">Reason for unapproving/denying post:</label>
              <div className="control">
                <textarea 
                  className="textarea" 
                  placeholder="Rejection reasons" 
                  required 
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button 
                  className="button is-danger"
                  onClick={() => {
                    approval ? approval.handleDeny(post) : handleUnapprove(post.id, adminComments)
                    setViewModal(false)
                    setAdminComments("")
                  }}
                >Confirm</button>
              </div>
              <div className="control">
                <button 
                  className="button is-warning"
                  onClick={() => {
                    setViewModal(false)
                    setAdminComments("")
                  }}
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {detail && (
            <PostHeaderImage src={`http://localhost:8000/posts?image=${post.id}&v=${post.updated_at}`}/>

      )}
      {post.status === "rejected" && post.admin_comments &&
        <article className="message is-warning">
          <div className="message-header">
            <p>Notice: Post Rejected</p>
          </div>
          <div className="message-body">
            {post.admin_comments}
          </div>
        </article>
      
      }
      <header className="card-header">
        <Link 
          style={{width: "50%"}}
          className="card-header-title mb-0 is-size-4" 
          to={`/post/${post.id}`}>
          {post.title}
        </Link>

        <div className="buttons has-addons">
          {detail && admin && post.status === "approved" ?
            <button 
              className="button card-header-icon is-text" 
              onClick={() => {
              setViewModal(true)
            }}>Unapprove</button> : <></>
          }

          {edit && (
            <button className="button card-header-icon" aria-label="edit post">
              <span className="icon">
                <MdEdit
                  onClick={() => {
                    navigate(`/post/${post.id}?edit=true`)
                  }}
                />
              </span>
            </button>
          )}

          {(edit || admin) && (
            <button
              className="button card-header-icon"
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
              🗑️ 
            </button>
          )}
        </div>
      </header>
      <div className="card-content py-3">
        <div className="content mb-0">
          {detail && <div style={{ marginBlock: 10 }}>{post?.content}</div>}

          <div>
            <div>
              <strong>By: </strong>
              <Link to={`/users/${post.user.id}`} className="has-text-primary">{post.user.username || post.user.author}</Link>
            </div>
            <div>
              <strong>Category: </strong>
              <a href={`/categories/${post?.category.label.toLowerCase().replaceAll(" ","_")}`}>{post?.category?.label ?? post?.category ?? ""}</a>
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

          {post.status === "approved" && detail && (
            <div className="buttons" style={{ marginBlock: 10, display: "flex", gap: "10px" }}>
              {post.reaction_counts.map(r => (
                <button 
                  title={r.label}
                  key={r.reaction_id}
                  className={`button is-small ${userReactions.find(ur => ur.reaction.label === r.label) ? "is-success" : ""} `}
                  style={{borderRadius: "99px"}}
                  onClick={
                    (e) => {
                      e.target.classList.add("is-loading")
                      const userReaction = userReactions.find(ur => ur.reaction.label === r.label) 
                      userReaction
                      ? handleRemoveReaction(userReaction.id)
                      : handleReaction(r.reaction_id)}}
                >{
                  r.emoji + (r.count > 0 ? "x " + r.count : "")}</button>

              ))}
            </div>
          )}

          {post.status === "approved" && 
          <><strong>Published: </strong>
          <HumanDate date={post?.publication_date} /></>}
          <div hidden={!viewingComments} className="pt-5">
            <div className="is-flex is-align-items-center pb-5">
              <h3 className="" style={{margin: 0}}>Comments</h3>
              <BiUpArrow className="button" style={{marginLeft: "auto"}} onClick={() => setViewingComments(false)}/>
            </div>
            <div style={{overflowY: "scroll", maxHeight: "300px"}} className="box comments-scroll">
              {comments.length > 0 && comments.slice(0,3).map(comment => (
                <article className="message is-small" key={comment.id}>
                  <div className={`modal ${viewCommentModal ? "is-active" : ""}`}>
                      <div 
                      className="modal-background"
                      onClick={() => setViewCommentModal(false)}
                    />
                      <div className="modal-content">
                        <p>Are you sure you want to delete this comment?</p>
                        <div className="buttons">
                              <button 
                                className="button is-danger"
                                onClick={() => {
                                  deleteComment(comment.id).then(({status, response}) => {
                                    if (status === 200) {
                                      setComments(prev => prev.filter(c => c.id !== comment.id))
                                    }
                                  })
                                  setViewCommentModal(false)
                                }}
                              >Confirm</button>
                              <button 
                                className="button is-warning"
                                onClick={() => {
                                  setViewCommentModal(false)
                                }}
                              >Cancel</button>
                        </div>
                      </div>
                  </div>
                  <div className="message-header">
                      <a 
                        href={`/post/${post.id}/comments/${comment.id}`} 
                        className="has-text-white hide-overflow is-size-6"
                        style={{textDecorationLine: "none"}}
                      >
                        {comment.subject}
                      </a>
                      <div className="buttons ml-auto">
                        {(currentUserId === comment.author?.id || currentUserId === comment?.author_id) && 
                        <button 
                          className="button"
                          onClick={() => {
                            navigate(`/post/${post.id}/comments/${comment.id}/edit`)
                          }}
                          >
                          <span className="icon is-small">
                            <MdEdit/>
                          </span>
                        </button>}
                        {(currentUserId === comment.author?.id || currentUserId === comment?.author_id || admin) && 
                        <button 
                          className="button"
                          onClick={() => {
                            setViewCommentModal(true)
                          }}
                          >
                          <span className="icon is-small">
                            <MdDelete/>
                          </span>
                        </button>}
                      </div>
                  </div>
                  <div className="message-body">
                    <div className="is-flex is-flex-direction-column">
                      <span>{comment.content}</span>
                      <div className="is-size-7 has-text-grey mt-3">
                        <span>Posted on </span>
                        <HumanDate date={comment.created_on}/>
                        <span> by </span>
                        <button 
                          className="button is-ghost is-small p-0 has-text-link" 
                          onClick={() => navigate(`/users/${comment.author.id}`)}
                        >
                          {comment.author?.username || comment?.username}
                        </button>
                      </div>
                    </div>

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
          <button 
            style={{borderRadius: 0, borderBottomLeftRadius: "6px"}}
            className="card-footer-item button is-success" 
            onClick={() => approval.handleApprove(post)}
          >Approve
          </button>
          <button 
            style={{borderRadius: 0, borderBottomRightRadius: "6px"}}
            className="card-footer-item button is-danger" 
            onClick={() => setViewModal(true)}
          >Deny
          </button>
      </footer> 
      :
      post.status === "approved" && !comment 
      ?
      <div className="card-footer">
        <button 
          style={{borderRadius: 0, borderBottomLeftRadius: "6px"}}
          className="card-footer-item button has-text-success" 
          onClick={() => setAddingComment(true)} disabled={post.status !== "approved"}
        >
          Add Comment
        </button>
        <button 
          style={{borderRadius: 0, borderBottomRightRadius: "6px"}}
          className={`card-footer-item button ${comments.length > 0 ? 'has-text-info' : 'has-text-gray'}`} 
          onClick={() => comments.length > 0 && setViewingComments(!viewingComments)} 
          disabled={comments.length === 0}
        >
          {!viewingComments ? "View Comments" : "Hide Comments"}
        </button>
      </div>
      :
      post.status === "draft" || post.status === "rejected"
      ?
      <div className="card-footer">
        <button 
          style={{borderRadius: 0, borderBottomLeftRadius: "6px"}}
          className="card-footer-item button is-success" 
          onClick={() => {
          submitPost(post.id).then(({status, response}) => {
            if (status === 200) {
              refresh && refresh()
              updatePost && response.then(updatePost)
              }
            })
          }}
        >
          Submit
        </button>
        <button 
        style={{borderRadius: 0, borderBottomRightRadius: "6px"}}
        className="card-footer-item button is-link" 
        onClick={() => {
          navigate(`/post/${post.id}?edit=true`)
        }}
        >
          Edit
      </button>
      </div>   
      :
        <></>
    }
    </div>
  )
}