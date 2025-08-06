import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ searchTerm, setSearchTerm }) {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="logo">THREADLY</Link>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/new">New post</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
