import { Link } from "react-router-dom"
import { IsAdmin } from "../utils/IsAdmin.js"

export const AdminNavLinks = ({token}) => {

    return IsAdmin(token) ?
        (
            <>
                <Link to="/admin/users" className="navbar-item">User Profiles</Link>
                <Link to="/admin/categories" className="navbar-item">Category Management</Link>
            </>
        ) 
        : 
            <></> 
}