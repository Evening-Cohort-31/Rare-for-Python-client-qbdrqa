import { useCallback, useEffect, useMemo, useState } from "react"
import { getUserById } from "../../managers/UserManager.js"
import { Post } from "../posts/Post.jsx"
import { BiSearchAlt2 } from "react-icons/bi"
import { getApprovedPublishedPosts, getPostByUserId, getSubscribedPosts } from "../../managers/PostManager.js"
import { IsAdmin } from "../utils/IsAdmin.js"

const panelTabs = [
  { label: "All", method: getApprovedPublishedPosts },
  { label: "My Posts", method: getPostByUserId },
  { label: "Subscriptions", method: getSubscribedPosts },
]

const userTabs = [
  { label: "All", filter: null },
  { label: "Published", filter: "approved" },
  { label: "Pending", filter: "submitted" },
  { label: "Drafts", filter: "draft" },
  { label: "Rejected", filter: "rejected" },
]

export const HomePage = ({ userId }) => {
  const [user, setUser] = useState()
  const [posts, setPosts] = useState([])
  const [currentPanelTab, setCurrentPanelTab] = useState(0)
  const [currentStatusTab, setCurrentStatusTab] = useState(0)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    IsAdmin(localStorage.getItem("auth_token")).then(setIsAdmin)
  }, [])

  const loadPostsForPanel = useCallback((panelIndex) => {
    setLoading(true)
    panelTabs[panelIndex]
      .method(userId, panelTabs[panelIndex].label === "My Posts" && userId)
      .then(({ status, response }) => {
        if (status === 200) {
          response.then((res) => {
            setPosts(res)
            setLoading(false)
          })
        } else {
          setLoading(false)
        }
      })
  }, [userId])

  const refreshPosts = () => {
    loadPostsForPanel(currentPanelTab)
  }

  useEffect(() => {
    setLoading(true)
    getUserById(userId).then(({ status, response }) => {
      setLoading(false)
      if (status === 200) {
        response.then(setUser)
      }
    })
  }, [userId])

  useEffect(() => {
    loadPostsForPanel(currentPanelTab)
  }, [currentPanelTab, loadPostsForPanel])

  useEffect(() => {
    setCurrentStatusTab(0)
    setSelectedSubscriptionId(null)
  }, [currentPanelTab])

  const statusCounts = useMemo(() => {
    return {
      all: posts.length,
      approved: posts.filter((p) => p.status === "approved").length,
      submitted: posts.filter((p) => p.status === "submitted").length,
      draft: posts.filter((p) => p.status === "draft").length,
      rejected: posts.filter((p) => p.status === "rejected").length,
    }
  }, [posts])

  const displayedPosts = useMemo(() => {
    let filtered = posts

    if (currentPanelTab === 1) {
      const filterTerm = userTabs[currentStatusTab].filter
      if (filterTerm) {
        filtered = filtered.filter((post) => post.status === filterTerm)
      }
    }

    if (currentPanelTab === 2 && selectedSubscriptionId !== null) {
      filtered = filtered.filter((post) => post.user.id === selectedSubscriptionId)
    }

    if (!searchTerm.trim()) return filtered

    const loweredSearch = searchTerm.toLowerCase()
    return filtered.filter((post) => post.title.toLowerCase().includes(loweredSearch))
  }, [posts, currentPanelTab, currentStatusTab, selectedSubscriptionId, searchTerm])

  // TODO: Add error states/handling, add pagination
  return (
    <div className="columns is-centered">
      <article className="panel column is-two-thirds mt-5 is-primary">
        <p className="panel-heading">
          {user ? user.username : <span className="title has-skeleton">Loading...</span>}
        </p>
        <p className="panel-tabs">
          {panelTabs.map((tab, i) => (
            <button
              key={i}
              className={`${currentPanelTab === i ? "is-active has-text-gray" : "has-text-info"}`}
              onClick={() => {
                setCurrentPanelTab(i)
              }}
            >
              {tab.label}
            </button>
          ))}
        </p>
        <div className="panel-block">
          <p className="control has-icons-left">
            <input
              className="input"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
            <span className="icon is-left">
              <BiSearchAlt2 />
            </span>
          </p>
        </div>
        <div className="panel-block columns is-centered">
          <div className="column is-narrow" style={{ marginBottom: "auto", marginTop: 15 }}>
            <aside className="menu">
              {currentPanelTab === 2 && (
                <>
                  <p className="menu-label">Subscriptions</p>
                  <ul className="menu-list">
                    <li>
                      <button
                        className={`${selectedSubscriptionId === null ? "is-active" : ""}`}
                        onClick={() => {
                          setSelectedSubscriptionId(null)
                        }}
                      >
                        All
                      </button>
                    </li>
                    {user?.subscriptions.map((sub) => (
                      <li key={sub.id}>
                        <button
                          className={`${sub.id === selectedSubscriptionId ? "is-active" : ""}`}
                          onClick={() => {
                            setSelectedSubscriptionId(sub.id)
                          }}
                        >
                          {sub.username}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {currentPanelTab === 1 && (
                <>
                  <p className="menu-label">Filters</p>
                  <ul className="menu-list">
                    <li>
                      <button
                        className={`button ${currentStatusTab === 0 ? "is-active" : ""} ${loading ? "is-loading" : ""}`}
                        onClick={() => {
                          setCurrentStatusTab(0)
                        }}
                      >
                        {"All ( " + statusCounts.all + " )"}
                      </button>
                    </li>
                    <li>
                      <button
                        className={`button ${currentStatusTab === 1 ? "is-active" : ""} ${loading ? "is-loading" : ""}`}
                        onClick={() => {
                          setCurrentStatusTab(1)
                        }}
                      >
                        {"Published ( " + statusCounts.approved + " )"}
                      </button>
                    </li>
                    <li>
                      <button
                        className={`button ${currentStatusTab === 2 ? "is-active" : ""} ${loading ? "is-loading" : ""}`}
                        onClick={() => {
                          setCurrentStatusTab(2)
                        }}
                      >
                        {"Pending ( " + statusCounts.submitted + " )"}
                      </button>
                    </li>
                    <li>
                      <button
                        className={`button ${currentStatusTab === 3 ? "is-active" : ""} ${loading ? "is-loading" : ""}`}
                        onClick={() => {
                          setCurrentStatusTab(3)
                        }}
                      >
                        {"Drafts ( " + statusCounts.draft + " )"}
                      </button>
                    </li>
                    <li>
                      <button
                        className={`button ${currentStatusTab === 4 ? "is-active" : ""} ${loading ? "is-loading" : ""}`}
                        onClick={() => {
                          setCurrentStatusTab(4)
                        }}
                      >
                        {"Rejected ( " + statusCounts.rejected + " )"}
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </aside>
          </div>
          <div className="column">
            {!loading
              ? displayedPosts.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    edit={post.user.id === Number(userId)}
                    admin={isAdmin}
                    refresh={refreshPosts}
                  />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <div className="card is-skeleton" key={i} style={{ marginTop: "10px", minHeight: 150 }} />
                ))}
          </div>
        </div>
      </article>
    </div>
  )
}
