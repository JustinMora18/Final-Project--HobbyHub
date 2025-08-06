import React, { useEffect, useState } from "react";
import pb from "../pocketbase/pocketbaseClient";
import PostCard from "../components/PostCard";
import "../styles/FeedLayout.css";

export default function HomeFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; 
        
        const fetchPosts = async () => {
            try {
                const result = await pb.collection("posts").getFullList();
                if (isMounted) {
                    setPosts(result);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching posts:", error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleUpdatePost = (updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
    };

    if (loading) return <p>Loading posts...</p>;

    return (
        <div className="feed-container">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdatePost={handleUpdatePost} />
            ))}
        </div>
    );
}
