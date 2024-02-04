import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import MessageUser from '../components/MessageUser';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Messages = () => {

    const navigate = useNavigate();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [activeFestival, setActiveFestival] = useState(null);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const responseFestival = await axiosPrivate.get('/festival/active');
                setActiveFestival(responseFestival.data.festival_id);
                const festivalId = responseFestival.data.festival_id;
                const response = await axiosPrivate.get('/message/' + (festivalId ? festivalId : ''));
                // Sort messages by date
                response.data.sort((a, b) => new Date(b.msg_date) - new Date(a.msg_date));
                setMessages(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMessages();
    }, [axiosPrivate, selectedMessage]);

    const handleDeleteMessage = async (message_id) => {
        try {
            const response = await axiosPrivate.delete('/message/' + "?message_id=" + message_id);
            console.log(response);
            const response2 = await axiosPrivate.get('/message/' + (activeFestival ? activeFestival : ''));
            setMessages(response2.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteAllMessages = async () => {
        try {
            const response = await axiosPrivate.delete('/message/clear-all/' + (activeFestival ? activeFestival : ''));
            console.log(response);
            const response2 = await axiosPrivate.get('/message/' + (activeFestival ? activeFestival : ''));
            setMessages(response2.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSelectMessage = (message) => {
        console.log('Selected message:', message);
        const to_set = {
            user_id: message.user_from,
            username: message.user_from_username,
            message: message.msg,
            festival_id: activeFestival,
        }
        setSelectedMessage(to_set);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (messages.length === 0) {
        return (
            <div>
                <h2 className="messages-heading">Messages</h2>
                {auth.roles.includes('Referent') && (
                    <button className='all-benev-button' style = {{marginRight: '5px'}} onClick={() => navigate('/contact/mes-benevoles/')}>Envoyer un message a mes bénévoles</button>
                )}
                {auth.roles.includes('Admin') && (
                    <button className='all-benev-button' onClick={() => navigate('/contact/everyone/')}>Envoyer un message a tout les bénévoles</button>
                )}
                <div>Nous n'avez pas de messages</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="messages-heading">Messages</h2>
            {!selectedMessage ? (
                <>
                    {auth.roles.includes('Referent') && (
                        <button className='all-benev-button' style =  {{marginRight: '5px'}} onClick={() => navigate('/contact/mes-benevoles/')}>Envoyer un message a mes bénévoles</button>
                    )}
                    {auth.roles.includes('Admin') && (
                        <button className='all-benev-button' onClick={() => navigate('/contact/everyone/')}>Envoyer un message a tout les bénévoles</button>
                    )}
                    <ul className="message-list">
                        {messages.map(message => (
                            <li key={message.message_id} className="message-item">
                                <div className="message-header" >
                                    <div><strong>De:</strong> {message.user_from_username} ({message.user_from_role})</div>
                                    <div>
                                    <button className='reply-button' style={{marginRight: '3px'}} onClick={() => handleSelectMessage(message)}>Repondre</button>
                                    <button className='delete-msg-button' onClick={() => handleDeleteMessage(message.message_id)}>Supprimer</button>
                                    </div>
                                </div>
                                <div className="message-date">
                                    <strong>Date:</strong> {new Date(message.msg_date).toLocaleString()}
                                </div>
                                <div className="message-content">
                                    <strong>Message:</strong> {message.msg}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className='delete-msg-button' onClick={() => handleDeleteAllMessages()}>Supprimer tous les messages</button>
                </>
            ) : (
                <MessageUser {...selectedMessage} setter={setSelectedMessage} />
            )}
        </div>
    );
};

export default Messages;
