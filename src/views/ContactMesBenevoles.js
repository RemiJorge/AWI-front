import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ContactMesBenevoles = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [festival_id, setFestivalId] = useState(null);
    const [postes, setPostes] = useState([]);
    const [selectedPoste, setSelectedPoste] = useState(null);

    const handleSendMessage = async () => {
        console.log('Sending msg:', message);
        const to_send = {
            festival_id: festival_id,
            poste_id: selectedPoste.poste_id,
            message: message
        }
        try {
            const response = await axiosPrivate.post('/message/notify-poste', to_send);
            console.log(response);
        }
        catch (err) {
            console.error(err);
        }
        setIsSent(true);
    };

    // useEffect to get the active festival and postes
    useEffect(() => {
        const fetchActiveFestival = async () => {
            try {
                const response = await axiosPrivate.get('/festival/active');
                setFestivalId(response.data.festival_id);
                const response2 = await axiosPrivate.get('/referent/my-postes' + (response.data.festival_id ? '/' + response.data.festival_id : ''));
                setPostes(response2.data);
                setSelectedPoste({ poste_id: response2.data[0].poste_id, poste_name: response2.data[0].poste });
            } catch (error) {
                console.error(error);
            }
        };

        fetchActiveFestival();
    }, [axiosPrivate]);

    const handleBack = () => {
        navigate('/messages');
    };

    return (
        <div className="message-user-container-mu" style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>Vous contactez les bénévoles du poste: {selectedPoste ? selectedPoste.poste_name : ''}</h3>

            {!isSent ? (
                <div className='form-group'>
                <label>
                        Sélectionnez un poste:
                    </label>
                    <div className='select-container-mu'>
                    <select
                        className='select-element-mu'
                        value={selectedPoste ? selectedPoste.poste_id : ''}
                        onChange={(e) => setSelectedPoste({ poste_id: e.target.value , poste_name: e.target.options[e.target.selectedIndex].text})}
                    >
                        {postes.map(poste => (
                            <option key={poste.poste_id} value={poste.poste_id}>
                                {poste.poste}
                            </option>
                        ))}
                    </select>
                    </div>
                    <label>
                        Votre message:
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder="Tapez ici..."
                    />

                    <div className='buttons-mu' style={{ marginTop: '20px' }}>
                        <button className="cancel-button-mu" onClick={handleBack}>Annuler</button>
                        <button className='send-button-mu' onClick={handleSendMessage}>Envoyer Message</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h4 style = {{marginBottom: '10px'}}>Message Envoyé!</h4>
                    <button className='cancel-button-mu' onClick={handleBack}>Voir mes messages</button>
                </div>
            )}
        </div>
    );
};

export default ContactMesBenevoles;
