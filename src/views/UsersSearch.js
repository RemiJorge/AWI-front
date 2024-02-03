import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

const USER_URL = "/users"

const UsersSearch = () => {

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

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
            <h1>Users</h1>
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
                            <button>Profile</button>
                            {auth.user_id !== user.user_id &&
                                <>
                                    <button>Envoyer un message</button>
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