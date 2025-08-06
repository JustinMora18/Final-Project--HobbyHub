import React, { useEffect, useState } from "react";
import pb from "../pocketbase/pocketbaseClient";
import PostCard from "../components/PostCard";
import "../styles/FeedLayout.css";

export default function HomeFeed({ searchTerm }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        let isMounted = true;

        const fetchPostsAndCommentsCount = async () => {
            setLoading(true);
            try {
                const postsResult = await pb.collection("posts").getFullList({
                    sort: sortBy === "newest" ? "-created" : "-upvotes",
                    requestKey: null,
                });

                if (!isMounted) return;

                const postsWithCounts = await Promise.all(
                    postsResult.map(async (post) => {
                        const comments = await pb.collection("comments").getFullList({
                            filter: `post_id = "${post.id}"`,
                            requestKey: null,
                        });

                        return {
                            ...post,
                            comments_count: comments.length,
                        };
                    })
                );

                if (!isMounted) return;

                setPosts(postsWithCounts);
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching posts or comments count:", error);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPostsAndCommentsCount();

        return () => {
            isMounted = false;
        };
    }, [sortBy]);

    if (loading) return <p>Loading posts...</p>;

    // Filtrar posts por título según searchTerm (case insensitive)
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="feed-container">
            <div className="sort-buttons">
                <span>Order by:</span>
                <button
                    className={`sort-button ${sortBy === "newest" ? "active" : ""}`}
                    onClick={() => setSortBy("newest")}
                >
                    Newest
                </button>
                <button
                    className={`sort-button ${sortBy === "popular" ? "active" : ""}`}
                    onClick={() => setSortBy("popular")}
                >
                    Most popular
                </button>
            </div>

            {filteredPosts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </div>
    );
}
