import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCommentById, updateComment } from "../managers/CommentManager"

export const CommentEditForm = () => {
  const { id, commentId } = useParams()
  const navigate = useNavigate()

  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [comment, setComment] = useState(null)

  useEffect(() => {
    getCommentById(commentId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then((c) => {
          setComment(c)
          setSubject(c.subject ?? "")
          setContent(c.content ?? "")
        })
      } else {
        response.then(console.log)
      }
    })
  }, [commentId])

  const save = (e) => {
    e.preventDefault()

    updateComment(commentId, { subject, content }).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(() => navigate(-1))
      } else {
        response.then(console.log)
      }
    })
  }

  const cancel = () => {
    navigate(-1)
  }

  if (!comment) return <p>Loading...</p>

  return (
    <div className="columns is-centered">
      <div className="column is-half">
        <form onSubmit={save}>
          <h1>Edit Comment</h1>
          <fieldset className="field">
            <label className="label">Subject</label>
            <div className="control">
              <input
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className="field">
            <label className="label">Content</label>
            <div className="control">
              <textarea
                className="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
              />
            </div>
          </fieldset>
          <button className="button is-link" type="submit">Save</button>
          <button className="button" type="button" onClick={cancel} style={{ marginLeft: "0.5rem" }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}