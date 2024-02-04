import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/poste-referent.css";

const PosteReferent = () => {
    const axiosPrivate = useAxiosPrivate();
    const { id, posteId } = useParams();
    const navigate = useNavigate();

    const [referent, setReferent] = useState([]);
    const [poste, setPoste] = useState({});
    const [searchUser, setSearchUser] = useState("")
    const [users, setUsers] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchPoste = async () => {
        try {
            const response = await axiosPrivate.get(`/poste/${id}`);
            console.log(response.data);
            response.data.forEach(p => {
                if ("" + p.poste_id === posteId) {
                    setPoste(p);
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }

    const fetchReferent = async () => {
        try {
            const data = {
                "poste_id": posteId,
                "festival_id": id
            }
            const response = await axiosPrivate.post(`/referent`, data);
            setReferent(response.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const addReferent = async (userId) => {
        try {
            const data = {
                "poste_id": posteId,
                "festival_id": id,
                "user_id": userId
            }
            const response = await axiosPrivate.post(`/referent/assign`, data);
            console.log(response.data);
            if (response.status === 200) {
                fetchReferent();
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const deleteReferent = async (userId) => {
        try {
            const data = {
                "poste_id": posteId,
                "festival_id": id,
                "user_id": userId
            }
            const response = await axiosPrivate.delete(`/referent/unassign`, { data });
            console.log(response.data);
            if (response.status === 200) {
                fetchReferent();
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchPoste();
        fetchReferent();
    }, [])

    const handleSearchUser = async () => {
        try {
            const limit = 5;
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
            const limit = 5;
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

    return (
        <div className="poste-referent-page">
            <h1>Poste : {poste.poste}</h1>
            <div>Description : {poste.description_poste}</div>
            <div>Capacité : {poste.max_capacity}</div>
            <button className="other-poste-button" onClick={() => navigate(`/festival-info/${id}`)}>Voir tous les postes</button>
            <h2>Referents</h2>
            {referent.length === 0 ? <div>Aucun referent pour ce poste</div>
            : <div className="current-referent-frame">
                {referent.map((ref, index) => {
                    return <div key={index} className="referent-info-frame">
                        <div>Surnom : {ref.username}</div>
                        <button onClick={() => navigate(`/profile/${ref.user_id}`)}>Voir le profil</button>
                        <button onClick={() => deleteReferent(ref.user_id)}>Retirer</button>
                    </div>
                })}
            </div>
            }
            <h2>Ajouter un referent</h2>
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
                                    <div>Surnom : {user.username}</div>
                                    <button onClick={() => navigate(`/profile/${user.user_id}`)}>Voir le profil</button>
                                    {referent.find(ref => ref.user_id === user.user_id) ? 
                                        <button onClick={() => deleteReferent(user.user_id)}>Retirer</button>
                                        : 
                                        <button onClick={() => addReferent(user.user_id)}>Ajouter</button>
                                    }

                                </div>
                            })}
                        </div>
                    }
                </>
            }
            {hasMore && <button onClick={moreUsers} className="voir-plus-button">Plus</button>}
        </div>
    );
};

export default PosteReferent;