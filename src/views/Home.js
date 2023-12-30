import { useNavigate, Link } from "react-router-dom";


const Home = () => {

    return (
        <div className="content">
            <h1>Accueil</h1>
            <Link to="/linkpage">Go to the link page</Link>
        </div>
    )
}

export default Home
