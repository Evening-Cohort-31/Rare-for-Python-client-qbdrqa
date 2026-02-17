import { useEffect, useState } from "react"
import { getAllCategories } from "./CategoryManager"

export const CategoryList = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getAllCategories().then(data => setCategories(data))
  }, [])

  return (
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