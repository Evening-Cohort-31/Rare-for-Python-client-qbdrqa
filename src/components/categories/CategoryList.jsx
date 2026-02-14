import { useEffect, useState } from "react"
import { getCategories, createCategory } from "../../managers/CategoryManager.js"

export const CategoryList = () => {
    const [categories, setCategories] = useState([])
    const [error, setError] = useState({error: false, message: ""})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getCategories().then(res => res.json().then(async res => {
            setLoading(false)
            if (res.status === 200) {
                const response = await res.response
                setCategories(response)
            } else if (res.status >=400 && res.status <500) {
                setError({error: true, message: "Action not supported"})
            } else if (res.status >=500) {
                setError({error: true, message: "Server error"})
            } else {
                setError({error: true, message: "An unexpected error has occurred"})
            }
        })).catch(err => {
            setLoading(false)
            setError({error: true, message: "An unexpected error has occurred."})
        })
    }, [])

    return (
        <div className="columns is-centered">
            <div className="column is-one-third">
                <h1>Categories</h1>
                {loading ? (
                    Array.from({ length: 5}).map((_, i) => (
                        <div className="card is-skeleton" key={i}/>
                    ))
                ) : categories.length > 0 ? categories.map(category => (
                    <div className="card" key={category.id} style={{ marginTop: "10px", minHeight: 50}}>
                        <header className="card-header">
                            <p className="card-header-title">${category.label}</p>
                        </header>
                    </div>
                )) : <>No Categories Found</>}
            </div>
        </div>
    )
}