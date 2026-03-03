import { useEffect, useState } from "react"
import { getCategories, deleteCategory } from "../../managers/CategoryManager.js"
import { Link } from "react-router-dom"

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([])

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

  return (
    categories.length > 0 && (
      <div className="container">
        <h1 className="title is-3 my-4">All Categories</h1>

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