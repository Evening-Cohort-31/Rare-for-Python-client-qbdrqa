import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "../managers/CommentManager";

export const CommentForm = ({postId, onCommentAdded}) => {
  const { id } = useParams(); // route is /post/:id/comments/new
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const saveComment = (e) => {
    e.preventDefault();

    const commentToSend = {
      post_id: parseInt(id) || postId,
      user_id: parseInt(localStorage.getItem("auth_token")),
      subject,
      content,
    };

    createComment(commentToSend).then(({ status, response }) => {
      if (status >= 200 && status < 300) {
        response.then((res) => {
          if (postId) {
            onCommentAdded(res)
            setSubject("")
            setContent("")
          } else {
          navigate(`/post/${id}/comments`)}});
      } else {
        response.then(console.log);
      }
    });
  };

  return (
    <form onSubmit={saveComment}>
      <h1>Add Comment</h1>

      <fieldset className="field">
        <label className="label">Subject</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
      </fieldset>

      <fieldset className="field">
        <label className="label">Comment</label>
        <div className="control">
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
          />
        </div>
      </fieldset>
      <fieldset className="field is-grouped">

        <button className="button is-success" type="submit">
          Save
        </button>
        <button className="button is-warning" onClick={() => {
          setContent("")
          setSubject("")
          onCommentAdded && onCommentAdded()
        }}>Cancel</button>
      </fieldset>

    </form>
  );
};
