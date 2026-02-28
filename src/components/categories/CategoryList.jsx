import { useEffect, useState } from "react"
import { getCategories, createCategory } from "../../managers/CategoryManager.js"

export const CategoryList = () => {
    const [categories, setCategories] = useState([])
    const [newCategoryLabel, setNewCategoryLabel] = useState("")
    const [error, setError] = useState({error: false, message: ""})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getCategories().then(async res => {
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
        }).catch(err => {
            setLoading(false)
            setError({error: true, message: "An unexpected error has occurred."})
        })
    }, [])

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
        <div>
            <h1 className="title" style={{justifySelf: "center"}}>Categories</h1>
            <div className="columns" style={{marginInline: 100}}>
                <div className="column is-half is-offset-one-quarter">

                    {loading ? (
                        Array.from({ length: 8}).map((_, i) => (
                        <div className="card is-skeleton" key={i} style={{ marginTop: "10px", minHeight: 50}}>
                        </div>
                        ))
                    ) : categories.length > 0 ? categories.map(category => (
                        <div className="card" key={category.id} style={{ marginTop: "10px", minHeight: 50}}>
                            <header className="card-header">
                                <p className={`card-header-title ${loading ? 'is-skeleton': ""}`}>{category.label}</p>
                            </header>
                        </div>
                    )) : <>No Categories Found</>}
                </div>
                <div className="column is-one-fourth" style={{marginLeft: 50}}>
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
            </div>
        </div>
    )
}