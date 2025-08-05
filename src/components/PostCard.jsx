import { Link } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
    return (
        <div className="post-card">
            <div className="post-header">
                <span>Posted {post.createdAt}</span>
                <span className="clickable">Click to see post</span>
            </div>
            <h4 className="post-username">👤 {post.username}</h4>
            <h3 className="post-title">▌ {post.title}</h3>
            <p className="post-content">
                {post.content}
            </p>
            <div className="post-tags">
                {post.tags.map((tag, idx) => (
                <span key={idx}>{tag} </span>
                ))}
            </div>
            <div className="post-footer">
                <span>👍 {post.upvotes}</span>
                <span>💬 {post.comments}</span>
            </div>
        </div>
    );
}

export default PostCard;
