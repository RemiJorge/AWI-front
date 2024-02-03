import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from 'react-router-dom';

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

    const fetchFestivals = async () => {
        try {
            const response = await axiosPrivate.get(FESTIVAL_URL);
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
     
    const DeleteFestival = async (festivalID) => {
        try {
            const response = await axiosPrivate.delete(FESTIVAL_URL + '?festival_id=' + festivalID);
            console.log(response);
        }
        catch (err) {
            console.log(err);
        } finally {
            fetchFestivals();
            fetchFestivalActive();
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
        }
    }

    return (
        <div className="content">
            <h1>Admin</h1>
            <button onClick={() => navigate('/users-search')}> Rechercher des utilisateurs</button>
            {!festivalActive || Object.keys(festivalActive).length === 0 ?
                <p>Pas de festival actif en cours</p>
            :<>
                <p>Festival actif en cours : {festivalActive.festival_name}</p>
                <p>Description : {festivalActive.festival_description}</p>
                <button onClick={() => handleActivateFestival(festivalActive.festival_id, false)}>Désactiver</button>
                <p>Charger un fichier de type CSV</p>
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
            </>}

            <h2>Créer un festival</h2>
            {openCreateFestival &&
                <form onSubmit={handleCreateFestival}>
                    <div>
                        <label htmlFor="festival_name">Nom</label>
                        <input type="text" id="festival_name" required onChange={(e) => setFestivalName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="festival_description">Description</label>
                        <input type="text" id="festival_description" required onChange={(e) => setFestivalDescription(e.target.value)} />
                    </div>
                    <button>Créer</button>
                </form>
            }
            <button onClick={() => setOpenCreateFestival(!openCreateFestival)}>
                {openCreateFestival ? "Annuler" : "Créer un festival"}
            </button>

            {festivals.length > 0 && 
                <div>
                    <h2>Festivals</h2>
                    <ul>
                        {festivals.map((festival, index) => 
                            <li key={index}>
                                <div>{festival.festival_name}</div>
                                <div>Description : {festival.festival_description}</div>
                                {(!festivalActive || Object.keys(festivalActive).length === 0 ) &&
                                    <button onClick={() => handleActivateFestival(festival.festival_id, true)}>
                                        Activer
                                    </button>
                                }
                                {(!festival.is_active) &&
                                    <button onClick={() => DeleteFestival(festival.festival_id)}>
                                        Supprimer
                                    </button>
                                }

                            </li>
                            
                        )}
                    </ul>
                </div>
            }
            
        </div>
    )
}

export default Admin