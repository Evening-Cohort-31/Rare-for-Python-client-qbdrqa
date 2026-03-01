import { Link } from "react-router-dom"
import { IsAdmin } from "../utils/IsAdmin.js"
import { useEffect, useState } from "react"

export const AdminNavLinks = ({token}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const closeDropdown = () => setIsOpen(false)

    useEffect(() => {
        IsAdmin(token).then(setIsAdmin)
    },[token])

    return isAdmin ?
        (
            <div className={`navbar-item has-dropdown ${isOpen ? 'is-active' : ''}`} onMouseOver={() => setIsOpen(true)} onMouseOut={() => setIsOpen(false)}>
                <button className="navbar-link" onClick={() => setIsOpen(!isOpen)}>
                    Admin
                </button>
                <div className="navbar-dropdown">
                    <Link to="/admin/users" className="navbar-item" onClick={closeDropdown}>User Profiles</Link>
                    <Link to="/admin/categories" className="navbar-item" onClick={closeDropdown}>Category Management</Link>
                    <Link to="/admin/unapproved_posts" className="navbar-item" onClick={closeDropdown}>Post Approval</Link>
                </div>
            </div>
        ) 
        : 
        <></> 
}