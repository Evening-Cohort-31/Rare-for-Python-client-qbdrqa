import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllTags, deleteTag, createTag } from "../../managers/TagManager.js"

export const TagManagement = () => {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("");

  const loadTags = () => {
    getAllTags().then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then(setTags)
      } else {
        response.then(console.log)
        setTags([])
      }
    })
  }

  useEffect(() => {
    loadTags()
  }, [])

  const handleDelete = (tagId) => {
    const confirmed = window.confirm("Are you sure you want to delete this tag?")
    if (!confirmed) return

    deleteTag(tagId).then(({ status }) => {
      if (status === 204 || (status >= 200 && status < 300)) {
        loadTags()
      } else {
        console.log("Delete failed", status)
      }
    })
  }

    const handleCreateTag = () => {
        if (newTag) {
            createTag({ label: newTag }).then(({status, response}) => {
              console.log(status)
              if (status >= 200 && status < 300) {
                setNewTag("");
                loadTags();
              } else {
                console.log(response)
              }
            });
        }
    };

  return (
    <>
      <div className="column is-one-third">
          <h2 className="title is-2">Create a Tag</h2>
          <div className="box">
              <div className="field">
                  <label className="label" htmlFor="newTag">Tag Label</label>
                  <div className="control">
                      <input
                          type="text"
                          className="input"
                          id="newTag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Enter new tag label"
                      />
                  </div>
              </div>
              <div className="control">
                  <button
                      className="button is-primary"
                      onClick={handleCreateTag}
                      title={tags.find(t => t.label.toLowerCase() === newTag.toLowerCase()) ? "This tag already exists" : ""}
                      disabled={tags.find(t => t.label.toLowerCase() === newTag.toLowerCase())}
                  >
                      Create Tag
                  </button>
              </div>
          </div>
      </div>
    {
    tags.length > 0 && (
      <div className="container">
        <h1 className="title is-3 my-4">All Tags</h1>

        <div className="columns is-multiline">
          {tags.map((tag) => (
            <div key={tag.id} className="column is-one-third">
              <div className="card">
                <div className="card-content">
                  <p className="title is-5">{tag.label}</p>

                  <div className="buttons mt-2">
                    <Link
                      className="button is-link is-light"
                      to={`/admin/tags/${tag.id}/edit`}
                      state={tags}
                    >
                      Edit
                    </Link>

                    <button
                      className="button is-danger is-light"
                      type="button"
                      onClick={() => handleDelete(tag.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }</>
  )
}