import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    return (
    <nav className="navbar">
        <div className="navbar-content">
            <Link to="/" className="logo">THREADLY</Link>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search"
                    disabled
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
