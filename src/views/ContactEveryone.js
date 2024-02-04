import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ContactEveryone = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [festival_id, setFestivalId] = useState(null);

    const handleSendMessage = async () => {
        console.log('Sending msg:', message);
        const to_send = {
            festival_id: festival_id,
            message: message
        }
        try {
            const response = await axiosPrivate.post('/message/everyone', to_send);
            console.log(response);
        }
        catch (err) {
            console.error(err);
        }
        setIsSent(true);
    };

    // useEffect to get the active festival
    useEffect(() => {
        const fetchActiveFestival = async () => {
            try {
                const response = await axiosPrivate.get('/festival/active');
                setFestivalId(response.data.festival_id);
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
            <h2 style={{ marginBottom: '20px' }}>Vous contactez tous les bénévoles</h2>

            {!isSent ? (
                <div className='form-group'>
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
                    <h4 style= {{marginBottom: '20px'}}>Message Envoyé!</h4>
                    <button className='cancel-button-mu' onClick={handleBack}>Voir mes messages</button>
                </div>
            )}
        </div>
    );
};

export default ContactEveryone;
