import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const MessageUser = ({ festival_id, user_id, username, message, setter }) => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [reply, setReply] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleSendReply = async () => {
        console.log('Sending reply:', reply);
        const to_send = {
            festival_id: festival_id,
            user_to: user_id,
            message: reply
        }
        try {
            const response = await axiosPrivate.post('/message/send', to_send);
            console.log(response);
        }
        catch (err) {
            console.error(err);
        }

        // Set isSent to true to display the confirmation message
        setIsSent(true);
    };

    const handleBack = () => {
        setter(null);
    };

    return (
        <div className="message-user-container-mu">
            {isSent ? (
                <div className="confirmation-mu">
                    <h2>Message Envoyé!</h2>
                    <button style={{marginTop: '20px'}} className='cancel-button-mu' onClick={handleBack}>Retour</button>
                </div>
            ) : (
                <div className="message-content-mu">
                    <div className="message-header-mu">Message de {username}:</div>
                    <div className="message-body-mu">{message}</div>

                    <div className="form-group">
                        <label>
                            <strong>Votre réponse:</strong>
                        </label>
                        <textarea
                            value={reply}
                            onChange={handleReplyChange}
                            rows={4}
                            placeholder="Votre réponse..."
                        />
                    </div>

                    <div className="buttons-mu">
                        <button className="cancel-button-mu" onClick={handleBack}>Annuler</button>
                        <button className="send-button-mu" onClick={handleSendReply}>Envoyer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageUser;
