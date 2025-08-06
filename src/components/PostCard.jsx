import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostCard.css";
import pb from "../pocketbase/pocketbaseClient";

function timeSince(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " years ago";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months ago";

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days ago";

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " hours ago";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes ago";

    return "just now";
}

export default function PostCard({ post }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/posts/${post.id}`);
    };

    const handleUpvote = async (id, currentUpvotes) => {
        try {
            await pb.collection("posts").update(id, {
                upvotes: currentUpvotes + 1,
            });
            window.location.reload();
        } catch (err) {
            console.error("Error updating upvotes:", err);
        }
    };

    return (
        <div className="post-card" onClick={handleClick}>
            <div className="post-header">
                <span className="post-time"> • posted {timeSince(post.created)}</span>
                <span className="post-username">@{post.username || "Anonymous"}</span>
                <h3 className="post-title">{post.title}</h3>
            </div>
            <p className="post-content">{post.content}</p>
            
            {(post.tags || []).length > 0 && (
                <div className="post-tags">
                    {(post.tags || []).map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="post-footer">
                <button
                    className="upvote-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(post.id, post.upvotes || 0);
                    }}
                >
                    ▲ {post.upvotes || 0}
                </button>

                <span className="post-comments">💬 {post.comments || 0}</span>
            </div>
        </div>
    );
}
