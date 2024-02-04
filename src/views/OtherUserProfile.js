import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const OtherUserProfile = () => {
    const navigate = useNavigate();
    const { user_id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosPrivate.get(`/users/${user_id}`);
                setUserData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserData();
    }, [axiosPrivate, user_id]);

    const handleContactClick = () => {
        // Handle contact logic
        console.log('Contacting user:', user_id);
        navigate(`/contact/${userData.username}/${user_id}`);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2 className="profile-heading">User Profile</h2>
            <div className="profile-info">
                <div>
                    <strong>Username:</strong> {userData.username}
                </div>
                {/*
                <div>
                    <strong>Email:</strong> {userData.email}
                </div>
                <div>
                    <strong>Nom:</strong> {userData.nom}
                </div>
                <div>
                    <strong>Prénom:</strong> {userData.prenom}
                </div>
                */}
                <div>
                    <strong>Telephone:</strong> {userData.telephone}
                </div>
                {userData.association &&
                <div>
                    <strong>Association:</strong> {userData.association}
                </div>
                }
                <div>
                    <strong>Taille T-Shirt:</strong> {userData.tshirt}
                </div>
                <div>
                    <strong>Vegan:</strong> {userData.vegan ? 'Oui' : 'Non'}
                </div>
                <div>
                    <strong>A la recherche d'un hebergement:</strong> {userData.hebergement}
                </div>
            </div>

            <button className="contact-button" onClick={handleContactClick}>Contact</button>
        </div>

    );
};

export default OtherUserProfile;
