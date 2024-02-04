import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

const USER_URL = "/users"

const UsersSearch = () => {

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);

    const fetchUsers = async () => {
        try {
            const response = await axiosPrivate.get(USER_URL + `?page=${page}&limit=20`);
            console.log(response.data);
            setUsers(response.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        console.log(users);
    }, [users])

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className="content">
            <h1>Utilisateur</h1>
            <div>
                {users.map((user, index) => {
                    return <div key={index}>
                            <div> Surnom : {user.username} </div>
                            {user.roles.includes("Admin") ?
                                <div> Role : Admin </div>
                            : user.roles.includes("Referent") ?
                                <div> Role : Referent </div>
                            : <div> Role : Bénévole </div>
                            }
                            <button onClick={() => navigate(`/profile/${user.user_id}`)}>Profile</button>
                            {auth.user_id !== user.user_id &&
                                <>
                                    <button onClick={() => navigate(`/contact/${user.username}/${user.user_id}`)} >Envoyer un message</button>
                                    <button>Bannir</button>
                                </>
                            }
                        </div>
                    }
                )}
            </div>
        </div>
    )
}

export default UsersSearch