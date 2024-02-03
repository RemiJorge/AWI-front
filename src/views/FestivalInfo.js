import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const FESTIVAL_URL = "/festival";

const FestivalInfo = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [Loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [festival, setFestival] = useState({});
    const [postes, setPostes] = useState([]);

    const [openCreatePoste, setOpenCreatePoste] = useState(false);
    const [posteName, setPosteName] = useState("");
    const [posteDescription, setPosteDescription] = useState("");
    const [maxCapacity, setMaxCapacity] = useState(0);

    const fetchFestival = async () => {
        try {
            const response = await axiosPrivate.get(`/festival`);
            console.log(response.data);
             
            response.data.forEach(f => {
                if ("" + f.festival_id === id) {
                    setFestival(f);
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }

    const fetchPostes = async () => {
        try {
            const response = await axiosPrivate.get(`/poste/${id}`);
            // alphanum sort
            response.data.sort((a, b) => a.poste.localeCompare(b.poste, 'en', { numeric: true }));
            setPostes(response.data);
        }
        catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFestival();
        fetchPostes();
    }, [])

    const deleteFestival = async (festivalID) => {
        try {
            const response = await axiosPrivate.delete(FESTIVAL_URL + '?festival_id=' + festivalID);
            console.log(response);
            navigate(`/admin`);
        }
        catch (err) {
            console.log(err);
        } finally {
            fetchFestival();
        }
    }

    const handleCreatePoste = async () => {
        try {
            const data = {
                "festival_id": id,
                "name": posteName,
                "description": posteDescription,
                "max_capacity": maxCapacity
            }
            const response = await axiosPrivate.post(`/poste`, data);
            console.log(response);
        }
        catch (err) {
            console.log(err);
        } finally {
            fetchPostes();
            setOpenCreatePoste(false);
        }
    }

    const deletePoste = async (posteName) => {
        try {
            const data = {
                "festival_id": id,
                "name": posteName
            }
            const response = await axiosPrivate.delete(`/poste`, { data });
            console.log(response);
        }
        catch (err) {
            console.log(err);
        } finally {
            fetchPostes();
        }
    }

    return (
        Loading ? <div>Loading...</div> : 
        <div>
            <h1>{festival.festival_name}</h1>
            <p>{festival.festival_description}</p>

            <h2>Postes</h2>
            {openCreatePoste ?
                <div>
                    <div>
                        <label htmlFor="posteName">Nom du poste</label>
                        <input type="text" value={posteName} onChange={(e) => setPosteName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="posteDescription">Description</label>
                        <input type="text" value={posteDescription} onChange={(e) => setPosteDescription(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="maxCapacity">Capacité</label>
                        <input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} />
                    </div>
                    <button onClick={() => setOpenCreatePoste(false)}>Annuler</button>
                    <button onClick={() => handleCreatePoste()}>Créer</button>
                </div>
            :
                <button onClick={() => setOpenCreatePoste(true)}>Créer un poste</button>
            }
            <ul>
                {postes.map((poste, index) => (
                    <li key={index}>
                        {poste.poste}
                        {poste.description_poste && <p>Description : {poste.description_poste}</p>}
                        {poste.max_capacity && <p>Capacity : {poste.max_capacity}</p>}
                        {poste.poste !== "Animation" && <button onClick={() => deletePoste(poste.poste)}>Supprimer</button>}
                    </li>
                ))} 
            </ul>

            {!festival.is_active &&
                <button onClick={() => deleteFestival(festival.festival_id)}>Supprimer le festival</button>
            }
        </div>
    )

}

export default FestivalInfo