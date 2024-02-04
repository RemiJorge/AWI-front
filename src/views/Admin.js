import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const FILE_URL = "/file"
const FESTIVAL_ACTIF_URL = "/festival/active"
const FESTIVAL_URL = "/festival"
const FESTIVAL_ACTIVATE = "/festival/activate"

const Admin = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Choisir un fichier");
    const [festivals, setFestivals] = useState([]);
    const [festivalActive, setFestivalActive] = useState({});
    const [openCreateFestival, setOpenCreateFestival] = useState(false);
    const [festivalName, setFestivalName] = useState("");
    const [festivalDescription, setFestivalDescription] = useState("");
    const [statusAssign, setStatusAssign] = useState("");

    const fetchFestivals = async () => {
        try {
            const response = await axiosPrivate.get(FESTIVAL_URL);
            response.data.sort((a, b) => b.festival_id - a.festival_id);
            setFestivals(response.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const fetchFestivalActive = async () => {
        try {
            const response = await axiosPrivate.get(FESTIVAL_ACTIF_URL);
            setFestivalActive(response.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchFestivals();
        fetchFestivalActive();
    }, [])

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        const name = e.target.files[0]?.name;
        name ? setFileName(name) : setFileName("Choisir un fichier");
    }

    const handleActivateFestival = async (festivalID, activate) => {
        try {
            const data = {
                "festival_id": festivalID,
                "is_active": activate
            }
            const response = await axiosPrivate.put(FESTIVAL_ACTIVATE, data);
            console.log(response);
        }
        catch (err) {
            console.log(err);
        } finally {
            fetchFestivalActive();
            fetchFestivals();
        }
    }

    const handleFileUpload = async () => {
        try{

            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            };
            const response = await axiosPrivate.post(FILE_URL, formData, config);
            console.log(response);
        }
        catch(err){
            console.log(err);
        } finally {
            setFile(null);
            setFileName("Choisir un fichier");
        }
    }

    const handleCreateFestival = async () => {
        try {
            const festival_name = festivalName;
            const festival_description = festivalDescription;
            const data = {
                "festival_name": festival_name,
                "festival_description": festival_description
            }
            const response = await axiosPrivate.post(FESTIVAL_URL, data);
            console.log(response);
        }
        catch (err) {
            console.log(err);
        } finally {
            fetchFestivals();
            setOpenCreateFestival(false);
        }
    }

    const handleAutoAssign = async () => {
        try {
            setStatusAssign("Calcul en cours...");
            const response = await axiosPrivate.put('inscription/poste/auto-assign-flexibles')
            console.log(response);
            if (response.status === 200) {
                setStatusAssign("Assignation terminée");
            }
        }
        catch (err) {
            console.log(err);
            setStatusAssign("Assignation échouée");
        }
    }

    return (
        <div className="admin-content">
            <h1>Gestion Administrateur</h1>
            <button className="search-users-button" onClick={() => navigate('/users-search')}> Rechercher des utilisateurs</button>
            <div className='festivals-frame'>
                <div className='festival-actif-frame'>
                    <h2>Festival actif</h2>
                    <div className='festival-actif-content'>
                        {!festivalActive || Object.keys(festivalActive).length === 0 ?
                            <p>Pas de festival actif en cours</p>
                        :<>
                            <div className="festival-description-frame">
                                <p>Nom du Festival: {festivalActive.festival_name}</p>
                                <p>Description : {festivalActive.festival_description}</p>
                                <div className="description-actif-button">
                                    <button className="info-actif-button" onClick={() => navigate('/festival-info/' + festivalActive.festival_id)}>Modifier</button>
                                    <button className="desactiver-button" onClick={() => handleActivateFestival(festivalActive.festival_id, false)}>Désactiver</button>
                                </div>
                            </div>
                            <div className="upload-csv-frame">
                                <p>Uploader un fichier CSV pour ajouter des animations</p>
                                <div className="upload-file">
                                    <input 
                                        type="file"
                                        id = "filecsv"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="filecsv">{fileName}</label>
                                    {file &&
                                        <button onClick={handleFileUpload}>Upload</button>
                                    }
                                </div>
                            </div>
                            <div className="assign-frame">
                                <p>Assigner automatiquement les personnes flexibles</p>
                                <button onClick={handleAutoAssign}>Auto-assigner</button>
                                {statusAssign && <p>{statusAssign}</p>}
                            </div>
                        </>}
                    </div>
                </div>
                <div className='festivals-list-frame'>
                    <h2>Festivals</h2>
                    {openCreateFestival ?
                        <div className="form-create-festival">
                            <div className="form-input">
                                <label htmlFor="festival_name">Nom</label>
                                <input type="text" id="festival_name" required onChange={(e) => setFestivalName(e.target.value)} />
                            </div>
                            <div className="form-input">
                                <label htmlFor="festival_description">Description</label>
                                <input type="text" id="festival_description" required onChange={(e) => setFestivalDescription(e.target.value)} />
                            </div>
                            <button className="create-festival-button" onClick={handleCreateFestival}>Créer</button>
                        </div>
                    : <button className="create-festival-button" onClick={() => setOpenCreateFestival(true)}>Créer un festival</button>
                    }

                    {festivals.length > 0 && 
                        <>
                            <ul>
                                {festivals.filter(festival => {
                                    if (festivalActive && Object.keys(festivalActive).length !== 0) {
                                        return festival.festival_id !== festivalActive.festival_id
                                    } else {
                                        return true
                                    }
                                    }).map((festival, index) => 
                                    <li key={index}>
                                        <div className="festivals-list-description-frame">
                                            <div>Nom:{festival.festival_name}</div>
                                            <div>{festival.festival_description}</div>
                                            <div className='festival-list-button-frame'>
                                                {(!festivalActive || Object.keys(festivalActive).length === 0 ) &&
                                                    <button onClick={() => handleActivateFestival(festival.festival_id, true)}>
                                                        Activer
                                                    </button>
                                                }
                                                <button onClick={() => navigate('/festival-info/' + festival.festival_id)}>
                                                    Modifier
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    
                                )}
                            </ul>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Admin