import React, { useState } from 'react';
import pb from '../pocketbase/pocketbaseClient';
import "../styles/NewPostForm.css";

export default function NewPostForm() {
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await pb.collection('posts').create({
                title,
                content,
                username,
                image_url: imageUrl,
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== ""),
            });

            setSuccess(true);
            setUsername("");
            setTitle("");
            setContent("");
            setImageUrl("");
            setTags("");
        }  catch (err) {
            setError('Error al crear el post.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="new-post-form">
            <h2>Create a new post</h2>

            <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
            />

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-field"
            />

            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={5}
                className="input-field"
            />

            <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input-field"
            />

            <input
                type="text"
                placeholder="Hashtags (comma-separated, e.g. #react, #frontend)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
            />

            <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Posting...' : 'Post'}
            </button>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Post created successfully!</p>}
        </form>
    );
}
