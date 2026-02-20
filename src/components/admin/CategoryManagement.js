import { useEffect, useState } from "react"
import { getCategories } from "../../managers/CategoryManager.js"

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories().then(data => data.response.then(setCategories))
  }, [])

  return (
    categories.length > 0 &&
    <div className="container">
      <h1 className="title is-3 my-4">All Categories</h1>
      <div className="columns is-multiline">
        {categories.map(category => (
          <div key={category.id} className="column is-one-third">
            <div className="card">
              <div className="card-content">
                <p className="title is-5">{category.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}