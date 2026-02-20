import { useEffect, useMemo, useState } from "react"
import { getAllTags } from "../../managers/TagManager.js"

export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [allTags, setAllTags] = useState([])

    useEffect(() => {
        getAllTags().then(({status, response}) => {
            if (status >= 200 && status <= 300) {
                response.then(setAllTags)
            }
        })
    }, [])

    const filteredTags = useMemo(() => 
        allTags.filter(tag => tag.label.toLowerCase().includes(searchTerm.toLowerCase())
), [searchTerm, allTags])

    return (
        <div 
            className={`dropdown is-right ${searchTerm !== "" && "is-active"}`}
            tabIndex={0}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setSearchTerm("")
                }
            }}
        >
            <div className="dropdown-trigger">
                <input className="input" type="text" placeholder="Search here" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    {filteredTags.map(tag => (

                        <a key={tag.id} href={`/posts/tags/${tag.id}`} className="dropdown-item">{tag.label}</a>
                    ))}
                </div>
            </div>
        </div>
    )
}