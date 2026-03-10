
import React, { useEffect, useState } from "react";
import { getAllTags, createTag } from "../../managers/TagManager";

export const TagManagement = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const fetchTags = () => {
        getAllTags().then(res => res.response.then(data => setTags(data)));
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleCreateTag = () => {
        if (newTag) {
            createTag({ label: newTag }).then(() => {
                setNewTag("");
                fetchTags();
            });
        }
    };

    return (
        <div className="container">
            <h1 className="title is-1">Tag Management</h1>
            <div className="columns">
                <div className="column">
                    <h2 className="title is-2">Tags</h2>
                    <div className="box">
                        <ul>
                            {tags.map(tag => (
                                <li key={tag.id}>{tag.label}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="column">
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
                            >
                                Create Tag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
