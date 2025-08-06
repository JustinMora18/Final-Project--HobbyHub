import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomeFeed from "./pages/HomeFeed.jsx";
import About from "./pages/About.jsx";
import NewPostForm from "./pages/NewPostForm.jsx";
import PostDetail from "./pages/PostDetail.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div className="app">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeFeed searchTerm={searchTerm} />} />
            <Route path="/about" element={<About />} />
            <Route path="/new" element={<NewPostForm />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
