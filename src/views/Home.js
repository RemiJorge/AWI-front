import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {

    const { auth } = useAuth();

    return (
        <div className="content">
            <h1>Accueil</h1>
            <p>Bienvenue sur le site de gestion des festivals</p>
            {auth?.accessToken ? 
                <div className="accueil-frame-info">
                    <p>Pour vous inscrire sur des postes consulté le planning</p>
                    <Link to="/job-planning" className="accueil-button">Voir le planning</Link>
                </div> : <div  className="accueil-frame-info">
                    <p>Connectez-vous pour accéder aux services</p> 
                    <Link to="/login" className="accueil-button">Connectez-vous</Link>
                </div>
            }   
        </div>
    )
}

export default Home
