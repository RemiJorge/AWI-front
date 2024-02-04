import { useNavigate, Link, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

const NabBar = () => {

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();
    const [nbNewMessages, setNbNewMessages] = useState(0);
    const [festivalId, setFestivalId] = useState(null);


    const signOut = async () => {
        await logout();
        //navigate('/');
    }

    const fetchNewMessages = async () => {
        try {
            const festival = await axiosPrivate.get('/festival/active');
            setFestivalId(festival.data.festival_id);
            const response = await axiosPrivate.get('/message/new/' + festival.data.festival_id);
            setNbNewMessages(response.data.new_messages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNewMessages();
    }
    , [axiosPrivate, auth]);

    return (
        <>
            <nav>
                <div className="nav-links">
                    <Link to="/job-planning">Planning</Link>
                    {auth?.roles?.includes("Admin") && <Link to="/admin">Admin</Link>}
                    {auth?.accessToken &&
                        <>
                            <Link onClick={() => setNbNewMessages(0)} to="/messages">Messages {nbNewMessages > 0 && <span>({nbNewMessages})</span>}</Link>
                            <Link to="/profile">Profile</Link>
                            
                        </>
                        
                    }
                </div>
                {auth?.accessToken ?  <button onClick={signOut}>Se déconnecter</button>
                    : <Link to="/login">Connectez-vous</Link>}
            </nav>
            <Outlet />
        </>
    )
}

export default NabBar