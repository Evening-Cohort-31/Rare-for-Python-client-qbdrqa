import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCategoryById, updateCategory } from "../../managers/CategoryManager"

export const CategoryEditForm = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const [label, setLabel] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategoryById(categoryId).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then((cat) => {
          setLabel(cat?.label ?? "")
          setLoading(false)
        })
      } else {
        response.then(console.log)
        setLoading(false)
      }
    })
  }, [categoryId])

  const handleSave = (e) => {
    e.preventDefault()

    updateCategory(categoryId, { label }).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        navigate("/admin/categories")
      } else {
        response.then(console.log)
      }
    })
  }

  if (loading) return <p>Loading...</p>

  return (
    <form onSubmit={handleSave}>
      <h1>Edit Category</h1>

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
        <button className="button is-success" type="submit">
          Save
        </button>

        <button
          type="button"
          className="button is-warning"
          onClick={() => navigate("/admin/categories")}
        >
          Cancel
        </button>
      </fieldset>
    </form>
  )
}