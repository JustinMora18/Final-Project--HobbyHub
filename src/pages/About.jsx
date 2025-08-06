import React from "react";
import "../styles/About.css";

export default function About() {
    return (
        <div className="about-container">
            <h2 className="about-title">About Threadly</h2>
            <p className="about-description">
                Threadly is a simple app where you can post your thoughts and read others' posts. 
                Built with <strong>React</strong> + <strong>PocketBase</strong>.
            </p>
        </div>
    );
}