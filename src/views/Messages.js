import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import MessageUser from './MessageUser';

const Messages = () => {
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
        return <div>No messages available</div>;
    }

    return (
        <div>
            <h2 className="messages-heading">Messages</h2>
            {!selectedMessage ? (
                <ul className="message-list">
                    {messages.map(message => (
                        <li key={message.message_id} className="message-item">
                            <div className="message-header" >
                                <div><strong>From:</strong> {message.user_from_username} ({message.user_from_role})</div>
                                <button className='reply-button' onClick={() => handleSelectMessage(message)}>Reply</button>
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
            ) : (
                <MessageUser {...selectedMessage} setter={setSelectedMessage} />
            )}
        </div>
    );
};

export default Messages;
