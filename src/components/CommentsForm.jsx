import React, { useState } from "react";
import pb from "../pocketbase/pocketbaseClient";

export default function CommentsForm({ postId, onNewComment }) {
    const [username, setUsername] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await pb.collection("comments").create({
                post_id: postId,
                username: username || "Anonymous",
                content,
            });

            setUsername("");
            setContent("");
            onNewComment();
        } catch (err) {
            setError("Error creating comment.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comments-form">
            <h4 className="comments-form-title">Add a comment</h4>

            <input
                type="text"
                placeholder="Your name (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="comments-form-input"
            />

            <textarea
                placeholder="Your comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
                disabled={loading}
                className="comments-form-textarea"
            />

            <button
                type="submit"
                disabled={loading || content.trim() === ""}
                className="comments-form-button"
            >
                {loading ? "Posting..." : "Post Comment"}
            </button>

            {error && <p className="comments-form-error">{error}</p>}
        </form>
    );
}
