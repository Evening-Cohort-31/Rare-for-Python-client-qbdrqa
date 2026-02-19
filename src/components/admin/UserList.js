import { useEffect, useState } from "react";
import {
  getAllUsers,
  toggleUserActivation,
} from "../../managers/UserManager.js";
import { Link } from "react-router-dom";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setLoading(false);
        console.log("Users API response:", data);
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("Invalid response from server");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleToggleUserActivation = (user) => {
    const newStatus = !user.active;
    toggleUserActivation({ ...user, active: newStatus }).then(async (res) => {
      if (res.status === 200) {
        const response = await res.response;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? response : u)),
        );
      }
    });
    setUser(null);
  };

  return (
    <div className="container">
      {user && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setUser(null)}></div>
          <div className="modal-content">
            <div className="box">
              <p>{`Are you sure you want to ${user.active ? "deactivate" : "activate"} ${user.username}?`}</p>
              <div className="field is-grouped pt-2">
                <button
                  className="button is-success"
                  onClick={() => handleToggleUserActivation(user)}
                >
                  Confirm
                </button>
                <button
                  className="button is-warning"
                  onClick={() => setUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h1 className="title is-3 my-4">All User Profiles</h1>
      {error && <div className="notification is-danger">{error}</div>}
      {!error && users.length === 0 && (
        !loading && <div className="notification is-warning">No users found.</div>
      )}
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {loading ?
          Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 5}).map((_, n) => (
                <td key={n} >
                  <div className="skeleton-lines" style={{width: "full"}}>
                    <div style={{width: "220px"}}></div>
                  </div>
                </td>
              ))}
            </tr>
          )):

          users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>
                {user.first_name} {user.last_name}
              </td>
              <td>{user.email}</td>
              <td>{user.is_staff ? "Admin" : "Author"}</td>
              <td>
                {user.active ? (
                  <button
                    className="button is-warning is-small"
                    onClick={() => setUser(user)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="button is-success is-small"
                    onClick={() => setUser(user)}
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
