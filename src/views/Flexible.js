import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { parse } from '@fortawesome/fontawesome-svg-core';

const Flexible = () => {
    const axiosPrivate = useAxiosPrivate();
    const [Loading, setLoading] = useState(true);
    const { id } = useParams();
    const [users, setUsers] = useState([]);

    const fetchFlexible = async () => {
        try {
            const data = {
                "festival_id": parseInt(id),
                "jour": "",
                "creneau": ""
            }
            console.log(data);
            const response = await axiosPrivate.post(`/inscription/poste/flexibles`, data);

            console.log(response.data);
            if (response.status === 200) {
                response.data.map((user) => {
                    let dataTransformed = [];
                    user.inscriptions.map((inscription) => {
                        if (dataTransformed[inscription.jour] === undefined) {
                            dataTransformed[inscription.jour] = [];
                        }
                        if (dataTransformed[inscription.jour][inscription.creneau] === undefined) {
                            dataTransformed[inscription.jour][inscription.creneau] = [inscription.poste];
                        } else {
                            dataTransformed[inscription.jour][inscription.creneau].push(inscription.poste);
                        }
                    });
                    user.inscriptions = dataTransformed;
                });
                console.log(response.data);
                setUsers(response.data);
            }
        }
        catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleAccept = async (userId, jour, creneau, poste) => {
        try {
            const data = {
                "festival_id": parseInt(id),
                "user_id": userId,
                "jour": jour,
                "creneau": creneau,
                "poste": poste
            }
            console.log(data);
            const response = await axiosPrivate.put(`/inscription/poste/assign`, data);
            console.log(response.data);
            if (response.status === 200) {
                fetchFlexible();
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    
    const handleRefuse = async (userId, jour, creneau, poste) => {
        try {
            const data = {
                "festival_id": parseInt(id),
                "user_id": parseInt(userId),
                "jour": jour,
                "creneau": creneau,
                "poste": poste
            }
            console.log(data);
            const response = await axiosPrivate.delete(`/inscription/poste/assign`, { data });
            console.log(response.data);
            if (response.status === 200) {
                fetchFlexible();
            }
        }
        catch (err) {
            console.error(err);
            console.log(err.response);
        }
    }

    useEffect(() => {
        fetchFlexible();
    }, [])

    if (Loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='flexible-content'>
            <h1>Utilisateur Flexible</h1>
            {users.length === 0 && <p>Aucun utilisateur flexible</p>}
            {users.map((user, index) => {
                return (
                    <div key={index}>
                        <h2>{user.username}</h2>
                        <div>
                            {Object.keys(user.inscriptions).map((jour, index) => {
                                return (
                                    <div key={index} >
                                        <h3>{jour}</h3>
                                        {Object.keys(user.inscriptions[jour]).map((creneau, index) => {
                                            return (
                                                <div key={index} className='flexible-creneau-frame'>
                                                    <h4>{creneau}</h4>
                                                    <div className='flexible-poste-frame'>
                                                        {user.inscriptions[jour][creneau].map((poste, index) => {
                                                            return (
                                                                <div key={index} className="flexible-poste-creneau">
                                                                    <p>{poste}</p>
                                                                    <div className="flexible-buttons">
                                                                        <button onClick={() => handleAccept(user.user_id, jour, creneau, poste)}>Accepter</button>
                                                                        <button onClick={() => handleRefuse(user.user_id, jour, creneau, poste)}>Refuser</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Flexible;
