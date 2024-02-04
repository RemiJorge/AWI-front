import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';

const USER_URL = "/users"

const UsersSearch = () => {

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState(null);
    const [page, setPage] = useState(1);
    const [searchUser, setSearchUser] = useState("");
    const [hasMore, setHasMore] = useState(false);


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

    const handleSearchUser = async () => {
        try {
            const limit = 10;
            const response = await axiosPrivate.get(`/users/search/username?username=${searchUser}&page=${page}&limit=${limit}`);
            console.log(response.data);
            setPage(1);
            if (response.status === 200) {
                // add response.data with previous state
                setUsers(response.data);
                if (response.data.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const moreUsers = async () => {
        try {
            const limit = 10;
            const response = await axiosPrivate.get(`/users/search/username?username=${searchUser}&page=${page + 1}&limit=${limit}`);
            console.log(response.data);
            if (response.status === 200) {
                // add response.data with previous state
                setUsers([...users, ...response.data]);
                if (response.data.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                setPage(page + 1);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        console.log(users);
    }, [users])

    useEffect(() => {
    }, [])

    return (
        <div className="content">
            <h1>Utilisateur</h1>
            <div>
                <input 
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={searchUser}
                    className="search-input"
                    onChange={(e) => setSearchUser(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchUser();
                        }
                    }}
                    />
                <button className="search-button" onClick={handleSearchUser}>Rechercher</button>
                {users && 
                <>
                    {users.length === 0 ? <div>Aucun utilisateur trouvé</div>
                    :   <div className="result-search-frame">
                            {users.map((user, index) => {
                                return <div key={index} className="referent-info-frame">
                                    <div> Surnom : {user.username} </div>
                                    {user.roles.includes("Admin") ?
                                        <div> Role : Admin </div>
                                    : user.roles.includes("Referent") ?
                                        <div> Role : Referent </div>
                                    : <div> Role : Bénévole </div>
                                    }
                                    <button onClick={() => navigate(`/profile/${user.user_id}`)}>Profile</button>
                                    {auth.user_id !== user.user_id && <button>Envoyer un message</button>}
                                </div>
                            })}
                        </div>
                    }
                </>
            }
            {hasMore && <button onClick={moreUsers} className="voir-plus-button">Plus</button>}
            </div>
        </div>
    )
}

export default UsersSearch