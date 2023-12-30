import { Link } from "react-router-dom"

const LinkPage = () => {
    return (
        <div className="content">
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/">Home</Link>
            <br />
            <h2>Private</h2>
            <Link to="/job-planning">Job Planning</Link>
            <Link to="/editor">Editor</Link>
        </div>
    )
}

export default LinkPage
