import { useEffect, useState } from "react";
import {
  getAllUsers,
  toggleUserActivation,
} from "../../managers/UserManager.js";
import { Link } from "react-router-dom";
import { BiDownArrow } from "react-icons/bi";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState([{ type: "active", value: 1 }]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState({
    active: false,
    selected: "active",
  });
  const [selectedButton, setSelectedButton] = useState()

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setLoading(false);
        console.log("Users API response:", data);
        if (Array.isArray(data)) {
          setUsers(data);
          setDisplayedUsers(data);
        } else {
          setError({error: true, msg: "Invalid response from server"});
        }
      })
      .catch((err) => setError({error: true, msg: err.message}));
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter((user) => {
      let include = true;
      filters.length > 0 &&
        filters.forEach((filter) => {
          if (user[filter.type] !== filter.value) include = false;
        });
      return include;
    });
    setDisplayedUsers(filteredUsers);
  }, [filters, users]);

  const handleToggleUserActivation = (user) => {
    const newStatus = !user.active;
    toggleUserActivation({ ...user, active: newStatus }).then(async (res) => {
      if (res.status === 200) {
        const response = await res.response;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? response : u)),
        );
      } else if (res.status === 409) {
        const r = await res.response
        setError({error: true, msg: r.error })
      }
    });
    setUser(null);
  };

  const handleActiveFilter = (filterString) => {
    setActiveFilter({ active: false, selected: filterString });

    if (filterString === "all") {
      setFilters(filters.filter((f) => f.type !== "active"));
    } else {
      const activeValue = filterString === "active" ? 1 : 0;
      const otherFilters = filters.filter((f) => f.type !== "active");
      setFilters([...otherFilters, { type: "active", value: activeValue }]);
    }
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
                  onClick={() => {
                    setUser(null)
                    selectedButton.classList.remove("is-loading")
                    setSelectedButton(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h1 className="title is-3 my-4">All User Profiles</h1>
      {error && <div className="notification is-danger">{error.msg}</div>}
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Username</th>
            <th style={{ width: "25%" }}>Full Name</th>
            <th style={{ width: "30%" }}>Email</th>
            <th style={{ width: "15%" }}>Type</th>
            <th style={{ width: "10%" }}>
              <div
                className={`dropdown ${activeFilter.active ? "is-active" : ""}`}
                tabIndex={0}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setActiveFilter({ ...activeFilter, active: false });
                  }
                }}
              >
                <div className="dropdown-trigger">
                  <button
                    className="button is-text p-0"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    onClick={() =>
                      setActiveFilter({
                        ...activeFilter,
                        active: !activeFilter.active,
                      })
                    }
                  >
                    <span className="is-capitalized has-text-white">{activeFilter.selected}</span>
                    <span className="icon is-small">
                      <BiDownArrow />
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <button
                      className={`dropdown-item ${activeFilter.selected === "all" && "is-selected"}`}
                      onClick={() => {
                        handleActiveFilter("all");
                      }}
                    >
                      View All
                    </button>
                    <button
                      className={`dropdown-item ${activeFilter.selected === "active" && "is-selected"}`}
                      onClick={() => {
                        handleActiveFilter("active");
                      }}
                    >
                      View Active
                    </button>
                    <button
                      className={`dropdown-item ${activeFilter.selected === "inactive" && "is-selected"}`}
                      onClick={() => handleActiveFilter("inactive")}
                    >
                      View Inactive
                    </button>
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 15 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, n) => (
                  <td key={n}>
                    <div className="skeleton-lines" style={{ width: "full" }}>
                      <div style={{ width: "220px", height: 30 }}></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : displayedUsers.length === 0 ? (
            <tr>
              <td colSpan="5" className="has-text-centered">
                No users found.
              </td>
            </tr>
          ) : (
            displayedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.username}</Link>
                </td>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td>
                    <div className="tags has-addons">
                      <span class={`tag ${user.is_staff ? "is-white" : "is-info"}`}>{user.is_staff ? "Admin" : "Author"}</span>
                      <button className={`tag button ${user.is_staff ? "is-danger" : "is-success"}`} disabled = {!user.active}>{user.is_staff ? "Demote" : "Promote"}</button>
                    </div>
                </td>
                <td>
                    <button
                      className={`button is-small ${user.active ? 'is-warning' : "is-success"}`}
                      onClick={(e) => 
                        {
                          e.target.classList.add("is-loading")
                          setSelectedButton(e.target)
                          setUser(user)
                        }}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

