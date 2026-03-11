import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getTagById, updateTag } from "../../managers/TagManager.js"

export const TagEditForm = () => {
  const { tagId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const tags = location.state

  const [label, setLabel] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTagById(tagId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then((tag) => {
          setLabel(tag?.label ?? "")
          setLoading(false)
        })
      } else {
        response.then(console.log)
        setLoading(false)
      }
    })
  }, [tagId])

  const handleSave = (e) => {
    e.preventDefault()

    updateTag(tagId, { label }).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        navigate("/admin/tags")
      } else {
        response.then(console.log)
      }
    })
  }

  if (loading) return <p>Loading...</p>

  return (
    <form onSubmit={handleSave}>
      <h1>Edit Tag</h1>

      <fieldset className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>
      </fieldset>

      <fieldset className="field is-grouped">
        <button 
          className="button is-success" 
          type="submit"
          title={tags.find(t => t.label.toLowerCase() === label.toLowerCase()) ? "This tag already exists, please make a change" : ""}
          disabled={tags.find(t => t.label.toLowerCase() === label.toLowerCase())}
          >
          Save
        </button>

        <button
          type="button"
          className="button is-warning"
          onClick={() => navigate("/admin/tags")}
        >
          Cancel
        </button>
      </fieldset>
    </form>
  )
}