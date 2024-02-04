import { useNavigate, Link, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const NabBar = () => {

    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();


    const signOut = async () => {
        await logout();
        //navigate('/');
    }


    return (
        <>
            <nav>
                <Link to="/job-planning">Planning</Link>
                {auth?.roles?.includes("Admin") && <Link to="/admin">Admin</Link>}
                {auth?.accessToken ? 
                    <>
                        <div><Link to="/messages">Messages</Link></div>
                        <div><Link to="/profile">Profile</Link></div>
                        <button onClick={signOut}>Se déconnecter</button>
                    </>
                    : <Link to="/login">Connectez-vous</Link>
                }
            </nav>
            <Outlet />
        </>
    )
}

export default NabBar