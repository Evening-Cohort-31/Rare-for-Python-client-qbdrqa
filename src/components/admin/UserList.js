import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUser,
} from "../../managers/UserManager.js";
import { Link } from "react-router-dom";
import { BiDownArrow } from "react-icons/bi";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null);
  const [filters, setFilters] = useState([{ type: "active", value: 1 }]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState({
    active: false,
    selected: "active",
  });

  const approver_id = Number(localStorage.getItem("auth_token"))

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
          setError({ error: true, msg: "Invalid response from server" });
        }
      })
      .catch((err) => setError({ error: true, msg: err.message }));
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

  const handleToggleUserActivation = (user, buttonElement, type) => {
    const action = {action: type, user_id : user.id, approver_id : approver_id}
    updateUser({ ...user, action: action }).then(async (res) => {
      buttonElement.classList.remove("is-loading")
      if (res.status === 200) {
        const response = await res.response;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? response : u)),
        );
      } else if (res.status === 409) {
        const r = await res.response;
        setError({ error: true, msg: r.error });
      }
    });
    setAction(null);
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

  const handlePromotion = (user, buttonElement, type) => {
  const action = {action: type, user_id : user.id, approver_id : approver_id}
    updateUser({ ...user, action: action }).then(
      async ({ status, response }) => {
        buttonElement.classList.remove("is-loading");
        const res = await response;
        if (status === 200) {
          setUsers((prev) =>
            prev.map((u) => {
              return u.id === user.id ? res : u;
            }),
          );
        } else if (status === 409) {
          setError({ error: true, msg: res.error });
        } else {
          setError({ error: true, msg: "An unknown error occurred" });
        }
      },
    );
    setAction(null)
  };

  const handleDemotion = (user, buttonElement, type) => {
    const action = {action: type, user_id : user.id, approver_id : approver_id}
    updateUser({ ...user, action: action}).then(
      async ({status, response}) => {
        buttonElement.classList.remove("is-loading");
        const res = await response;
        if (status === 200) {
          setUsers((prev) => 
            prev.map((u) => {
              return u.id === user.id ? res: u;
            }),
          );
        } else if (status === 409) {
          setError({ error: true, msg: res.error });
        } else {
          setError({ error: true, msg: "An unknown error occurred"});
        }
      },
    );
    setAction(null)
  };

  const checkForDisabled = (action, user) => {
    if (user.type === "author" && action === "demote" && !user.active) {
      return {disabled: true, title: "Must activate first"}
    } else if (users.filter(u => u.type === "admin").length === 1 && user.type === "admin") {
      return {disabled: true, title: `You cannot ${action} the last admin. Set a new admin first.`}
    } else if ("demotion_queue" in user && user.demotion_queue.find(d => d.action === action)) {
      if (user.demotion_queue.find(d => d.action === action ).approver_one_id === approver_id) {
        return {disabled: true, title: `Another admin must finalize this action.`}} else {
          return {disabled: false, title: ""}
        }
    } else {
      return {disabled: false, title: ""}
    }
  } 

  const handleCancelAction = (user, buttonElement, type) => {
    const action = {action: type, user_id: user.id, approver_id: approver_id}
    updateUser({...user, action: action}).then(async ({status, response}) => {
      buttonElement.classList.remove("is-loading")
      const res = await response
      if (status === 200) {
        setUsers(prev => prev.map(u => {
          return u.id === user.id ? res: u
        }))
      } else if (status === 409) {
        setError({error: true, msg: res.error})
      } else {
        setError({ error: true, msg: "An unknown error occurred"})
      }
    });
    setAction(null)
  }
  
  const confirmationStrings = {
    "demote" : "demote",
    "promote": "promote",
    "deactivate": "deactivate",
    "cancel deactivate" : "cancel the deactivation of ",
    "cancel demote" : "cancel the demotion of "
  }

  return (
    <div className="container">
      {action && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setAction(null)}></div>
          <div className="modal-content">
            <div className="box">
              <p>{`Are you sure you want to ${confirmationStrings[action.type]} ${action.user.username}?`}</p>
              <div className="field is-grouped pt-2">
                <button
                  className="button is-success"
                  onClick={() => action.method(action.user, action.button, action.type)}
                >
                  Confirm
                </button>
                <button
                  className="button is-warning"
                  onClick={() => {
                    action.button.classList.remove("is-loading")
                    setAction(null);
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
            <th style={{ width: "20%" }}>Full Name</th>
            <th style={{ width: "25%" }}>Email</th>
            <th style={{ width: "20%" }}>Type</th>
            <th style={{ width: "15%" }}>
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
                    <span className="is-capitalized has-text-white">
                      {activeFilter.selected}
                    </span>
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
                  <div
                    className="tags has-addons"
                    title={checkForDisabled("demote", user).title}
                  >
                    <span
                      className={`tag ${user.type === "admin" ? "is-warning" : "is-info"}`}
                    >
                      {user.type === "admin" ? "Admin" : "Author"}
                    </span>
                    <button
                      className={`tag button ${user.type === "admin" ? "is-danger" : "is-success"}`}
                      disabled={
                        checkForDisabled("demote", user).disabled
                      }
                      onClick={(e) => {
                        e.target.classList.add("is-loading");
                        setAction({user: user, method: user.type === "admin" ? handleDemotion : handlePromotion, type: user.type === "admin" ? "demote" : "promote", button: e.target})
                      }}
                    >
                      {user.type === "admin" 
                        ? 
                          ("demotion_queue" in user && user.demotion_queue.find(d => d.action === "demote"))
                            ? "Finalize Demotion"
                            : "Start Demotion" 
                        : "Promote"}
                    </button>
                    {"demotion_queue" in user && user.demotion_queue.find(d => d.action === "demote") && 
                      <button 
                        className="tag is-delete" 
                        title="Cancel Demotion"
                        onClick={(e) => {
                          e.target.classList.add("is-loading");
                          setAction({user: user, method: handleCancelAction, type: "cancel demote", button: e.target})
                        }}
                      />}
                  </div>
                </td>
                <td>
                  <div className="tags has-addons" title={checkForDisabled("deactivate", user).title}>
                    <button
                      className={`button is-small tag ${user.active ? "is-danger" : "is-success"}`}
                      onClick={(e) => {
                        e.target.classList.add("is-loading");
                        setAction({user: user, method: handleToggleUserActivation, type: user.active ? "deactivate" : "activate", button: e.target});
                      }}
                      disabled={checkForDisabled("deactivate", user).disabled}
                    >
                      {
                        user.type === "author" 
                          ?
                            user.active 
                            ? 
                              "Deactivate" 
                            : "Activate"
                          :
                            ("demotion_queue" in user && user.demotion_queue.find(d => d.action === "deactivate"))
                            ?
                            "Finalize Deactivation"
                            : "Start Deactivation"
                          
                      }
                    </button>
                    {"demotion_queue" in user && user.demotion_queue.find(d => d.action === "deactivate") && 
                      <button 
                        className="tag is-delete" 
                        title="Cancel Deactivation"
                        onClick={(e) => {
                          e.target.classList.add("is-loading")
                          setAction({user: user, method: handleCancelAction, type: "cancel deactivate", button: e.target})

                        }}
                      />}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

