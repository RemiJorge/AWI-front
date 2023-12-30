import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <div className="content">
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </div>
    )
}

export default Missing
