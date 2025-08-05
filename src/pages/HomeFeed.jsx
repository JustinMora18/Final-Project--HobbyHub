import PostCard from "../components/PostCard";

function HomeFeed() {
    const samplePost = {
        id: 1,
            username: "JustinMora18",
            createdAt: "3h ago",
            title: "Why I Think WebAssembly Will Reshape Frontend Development",
            content:
                "I've been experimenting with WebAssembly (WASM) over the past few weeks, and honestly, I'm blown away by its performance...",
            tags: ["#WebAssembly", "#Frontend", "#JavaScript", "#Rust"],
            upvotes: 10,
            comments: 3,
    };

    return (
        <div className="feed-container">
            <PostCard post={samplePost} />
        </div>
    );
}

export default HomeFeed;
