import { useCallback, useEffect, useMemo, useState } from "react"
import { getAllTags } from "../../managers/TagManager.js"
import debounce from "lodash.debounce"
import { searchPostsByTitle } from "../../managers/PostManager.js"
import { useNavigate } from "react-router-dom"

export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [allTags, setAllTags] = useState([])
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

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

    const handleSearch = useCallback(debounce(async (term) => {
        term.length > 0 && searchPostsByTitle(term).then(({status, response}) => {
            if (status >=200 && status <=300) {
                response.then(setPosts)
            }
        })
    }, 300), [searchTerm])

    useEffect(() => {
        return () => {
            handleSearch.cancel()
        }
    },[handleSearch])

    useEffect(() => {
        handleSearch(searchTerm)
    }, [searchTerm])

    const handleViewMore = () => {
        navigate(`/posts?title=${searchTerm}`, {state: posts} )
        setSearchTerm("")
    }
    return (
        <div 
            className={`dropdown is-right ${searchTerm !== "" && "is-active"}`}
            tabIndex={0}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setSearchTerm("")
                    setPosts([])
                }
            }}
        >
            <div className="dropdown-trigger">
                <input className="input" type="text" placeholder="Search here" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <div className="dropdown-item has-text-right">Tags</div>
                    {filteredTags.length > 0 ? filteredTags.map(tag => (
                        <a key={tag.id} href={`/posts/tags/${tag.id}`} className="dropdown-item">{tag.label}</a>
                    )):<div className="dropdown-item">No tags match this search...</div> }
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item has-text-right">Posts</div>
                    {posts.length > 0 ? posts.slice(0,5).map(post => (
                        <a key={post.id} href={`/post/${post.id}`} className="dropdown-item">{post.title}</a>
                    )): <div className="dropdown-item">No posts match this search...</div>}
                    {posts.length > 5 && <button className="dropdown-item" onClick={handleViewMore}>View more results...</button>}
                </div>
            </div>
        </div>
    )
}