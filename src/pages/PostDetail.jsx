import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pb from "../pocketbase/pocketbaseClient";
import CommentsForm from "../components/CommentsForm";
import "../styles/PostDetail.css";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchComments = async () => {
        try {
            const fetchedComments = await pb.collection("comments").getFullList({
                filter: `post_id = "${id}"`,
                sort: "-created",
            });
            setComments(fetchedComments);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!id) return;

        let isActive = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedPost = await pb.collection("posts").getOne(id);
                if (!isActive) return;

                setPost(fetchedPost);
                setTitle(fetchedPost.title);
                setContent(fetchedPost.content);
                await fetchComments();
            } catch (err) {
                if (!isActive) return;
                setError("Error loading post or comments.");
                console.error(err);
            } finally {
                if (!isActive) return;
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            isActive = false;
        };
    }, [id]);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updated = await pb.collection("posts").update(id, {
                title,
                content,
            });
            setPost(updated);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError("Error updating post.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await pb.collection("posts").delete(id);
            navigate("/");
        } catch (err) {
            setError("Error deleting post.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirm = window.confirm("Delete this comment?");
        if (!confirm) return;

        try {
            await pb.collection("comments").delete(commentId);

            setComments((prev) => prev.filter((c) => c.id !== commentId));

            const currentPost = await pb.collection("posts").getOne(id);
            await pb.collection("posts").update(id, {
                comments_count: Math.max(0, (currentPost.comments_count || 1) - 1),
            });

            setPost((prev) => ({
                ...prev,
                comments_count: Math.max(0, (prev?.comments_count || 1) - 1),
            }));
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>No post found.</p>;

    return (
        <div className="post-detail">
            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        className="edit-input"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                        rows={6}
                        className="edit-textarea"
                    />
                    <button onClick={handleUpdate} disabled={loading} className="btn-save">
                        Save
                    </button>
                    <button onClick={handleEditToggle} disabled={loading} className="btn-cancel">
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="post-content">
                    <div className="post-actions">
                        <button onClick={handleEditToggle} className="btn-edit">Edit</button>
                        <button onClick={handleDelete} className="btn-delete">Delete</button>
                    </div>
                    <p className="post-author">@{post.username || "Anonymous"}</p>
                    <h1 className="post-title">{post.title}</h1>

                    {post.image_url && (
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="post-image"
                        />
                    )}

                    <p className="post-body">{post.content}</p>

                    {post.tags?.length > 0 && (
                        <div className="post-tags">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    <p className="post-likes">Upvotes: {post.upvotes || 0}</p>

                    <div className="comments-section">
                        <h3>Comments</h3>
                        {comments.length === 0 ? (
                            <p>No comments yet.</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <p><strong>@{comment.username || "Anonymous"}</strong>: {comment.content}</p>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="btn-comment-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <CommentsForm postId={id} onNewComment={fetchComments} />
                </div>
            )}
        </div>
    );
}
