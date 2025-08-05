import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomeFeed from "./pages/HomeFeed.jsx";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<HomeFeed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
