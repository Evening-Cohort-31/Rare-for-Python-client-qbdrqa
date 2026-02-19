import { useEffect, useState } from "react"
import { getAllUsers } from "../../managers/UserManager.js"
import { Link } from "react-router-dom"

export const UserList = () => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllUsers()
      .then(data => {
        console.log("Users API response:", data)
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          setError("Invalid response from server")
        }
      })
      .catch(err => setError(err.message))
  }, [])

  return (
    <div className="container">
      <h1 className="title is-3 my-4">All User Profiles</h1>
      {error && <div className="notification is-danger">{error}</div>}
      {!error && users.length === 0 && <div className="notification is-warning">No users found.</div>}
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.is_staff ? "Admin" : "Author"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}