import { useEffect, useState } from "react"
import { getCategories, deleteCategory, createCategory } from "../../managers/CategoryManager.js"
import { Link } from "react-router-dom"

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [newCategoryLabel, setNewCategoryLabel] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadCategories = () => {
    getCategories().then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setCategories)
      } else {
        response.then(console.log)
        setCategories([])
      }
    })
  }

  useEffect(() => {
    loadCategories()    
  }, [])

  const handleDelete = (categoryId) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?")
    if (!confirmed) return

    deleteCategory(categoryId).then(({ status }) => {
      if (status === 204 || (status >= 200 && status < 300)) {
        loadCategories()
      } else {
        console.log("Delete failed", status)
      }
    })
  }

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault()

    const formatCategory = newCategoryLabel.replaceAll("_", "-")

    if (categories.find( c => String(c.label).toLowerCase() === formatCategory.toLowerCase())) {
        setLoading(false)
        setError({error: true, message: "This category already exists"})
        return
    }

    createCategory({"label": formatCategory}).then(async res => {
        setLoading(false)
        setNewCategoryLabel("")
        const status = res.status
        if (status === 201) {
            const response = await res.response
            setCategories(...categories, response)
            getCategories().then(async res => setCategories(await res.response))
        } else if (res.status >=400 && res.status <500) {
            setError({error: true, message: "Action not supported"})
        } else if (res.status >=500) {
            setError({error: true, message: "Server error"})
        } else {
            setError({error: true, message: "An unexpected error has occurred."})
        }
    })
}

  return (
    categories.length > 0 && (
      <div className="container">
        <h1 className="title is-3 my-4">All Categories</h1>
          <div className="mb-5" style={{width: 250}}>
              <div className="card" style={{marginTop: "10px"}}>
                  <header className="card-header">
                      <p className="card-header-title">Create New Category</p>
                  </header>
                  <div className="card-content">
                      <div className="field">
                          <label className="label">Label</label>
                          <div className="control">
                              <input className="input" type="text" value={newCategoryLabel} onChange={(e) => {
                                  setNewCategoryLabel(e.target.value)
                                  setError(null)
                                  }}/>
                          </div>
                          {error ? <p className="help is-danger">{error.message}</p> : <></>}
                      </div>
                  </div>
                  <footer className="card-footer">
                      <button className="card-footer-item button is-success" onClick={handleSubmit}>Submit</button>
                  </footer>
              </div>
          </div>
        <div className="columns is-multiline">
          {categories.map((category) => (
            <div key={category.id} className="column is-one-third">
              <div className="card">
                <div className="card-content">
                  <p className="title is-5">{category.label}</p>

                  <div className="buttons mt-2">
                    <Link
                      className="button is-link is-light"
                      to={`/admin/categories/${category.id}/edit`}
                    >
                      Edit
                    </Link>

                    <button
                      className="button is-danger is-light"
                      type="button"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  )
}