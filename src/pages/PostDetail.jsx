import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import pb from "../pocketbase/pocketbaseClient";
import "../styles/PostDetail.css";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postComments, setPostComments] = useState([]);

    const [commentText, setCommentText] = useState("");
    const [commentUsername, setCommentUsername] = useState("");

    useEffect(() => {
        if (!id) return;

        let isMounted = true;

        const fetchData = async () => {
            try {
                const fetchedPost = await pb.collection("posts").getOne(id);
                const comments = await pb.collection("comments").getFullList({
                    filter: `post_id="${id}"`,
                    sort: "-created",
                });

                if (isMounted) {
                    setPost(fetchedPost);
                    setPostComments(comments);
                }
            } catch (err) {
                console.error("Error loading post or comments:", err);
                if (isMounted) setError("Error loading post.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const newComment = await pb.collection("comments").create({
                content: commentText,
                username: commentUsername,
                post_id: id,
            });

            setPostComments((prev) => [newComment, ...prev]);
            setCommentText("");
            setCommentUsername("");
        } catch (err) {
            console.error("Error creating comment:", err);
        }
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>No post found.</p>;

    return (
        <div className="post-detail">
            <h1>{post.title}</h1>
            <p className="author">@{post.username || "Anonymous"}</p>
            <p className="content">{post.content}</p>
            <p className="upvotes">upvotes: {post.upvotes || 0}</p>

            <div className="comments-section">
                <h3>Comments</h3>
                {postComments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    postComments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p className="comment-user">@{comment.username}</p>
                            <p className="comment-text">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="add-comment">
                <h4>Add a comment</h4>
                <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={commentUsername}
                        onChange={(e) => setCommentUsername(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Write your comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
