import { useState , useEffect} from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useParams } from 'react-router-dom';

const ContactReferent = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { id, posteName } = useParams();

    const [referent, setReferent] = useState([]);
    const [poste, setPoste] = useState({});

    const fetchReferent = async () => {
        try {
            const data = {
                "poste_id": poste.poste_id,
                "festival_id": id
            }
            const response = await axiosPrivate.post(`/referent`, data);
            setReferent(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    const fetchPoste = async () => {
        try {
            const response = await axiosPrivate.get(`/poste/${id}`);
            if (response.status === 200){
                response.data.forEach(p => {
                    if ("" + p.poste === posteName) {
                        setPoste(p);
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchPoste();
    }, [])

    useEffect(() => {
        if (poste.poste_id) {
            fetchReferent();
        }
    }, [poste])

    return (
        <div>
            <h1>Referents pour le poste {poste.poste}</h1>
            <div>
                {!referent || referent.length === 0 ? 
                    <div>Il n'y a pas de referent pour ce poste</div>
                : 
                    referent.map((ref, index) => {
                        return <div key={index}>
                            <div style={{margin: '10px'}}> Surnom : {ref.username} </div>
                            <button className='send-button-mu' onClick={() => navigate(`/contact/${ref.username}/${ref.user_id}`)}>
                                Envoyer un message
                            </button>
                        </div>
                    })
                }

                
            </div>
        </div>
    )
}

export default ContactReferent;