import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Contact = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { username, user_id } = useParams();
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [festival_id, setFestivalId] = useState(null);

    const handleSendMessage = async () => {
        console.log('Sending msg:', message);
        const to_send = {
            festival_id: festival_id,
            user_to: user_id,
            message: message
        }
        try {
            const response = await axiosPrivate.post('/message/send', to_send);
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
            <h2>Vous contactez: {username}</h2>

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
                    <h3>Message Envoyé!</h3>
                    <button className='cancel-button-mu' onClick={handleBack}>Voir mes messages</button>
                </div>
            )}
        </div>
    );
};

export default Contact;
