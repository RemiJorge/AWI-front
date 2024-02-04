import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Profile = () => {

    const { auth } = useAuth();
    const navigate = useNavigate();

    const axiosPrivate = useAxiosPrivate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [modifiedData, setModifiedData] = useState({});
    const [message, setMessage] = useState(''); // message to display after updating the user info

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModifiedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEditClick = () => {
        setMessage('');
        setIsEditMode(true);
    };

    const getUserData = async () => {
        try {
            const response = await axiosPrivate.get('/users/my-info');
            setModifiedData(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getUserData();
    }
        , [])

    const handleConfirmClick = async () => {
        // send modifiedData to the server
        try {
            const response = await axiosPrivate.put('/users/update-info', modifiedData);
            if (response.status === 200) {
                setMessage('Votre profil a été mis à jour avec succès');
            }
            console.log(response);
        }
        catch (err) {
            console.error(err);
        }
        setIsEditMode(false);
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>
                User Profile
            </h2>
            {/*username and email are not editable*/}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ marginBottom: '10px', textAlign: 'left'}}>
                    Username: {modifiedData.username}
                </div>
                <div style={{ marginBottom: '10px', textAlign: 'left'}}>
                    Email: {modifiedData.email}
                </div>
                <div className='form-group'>
                    <label>
                        Nom:
                    </label>
                    <input
                        type="text"
                        name="nom"
                        value={modifiedData.nom}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                </div>
                <div className='form-group'>
                    <label>
                        Prénom:
                    </label>
                    <input
                        type="text"
                        name="prenom"
                        value={modifiedData.prenom}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                </div>
                <div className='form-group'>
                    <label>
                        Telephone:
                    </label>
                    <input
                        type="text"
                        name="telephone"
                        value={modifiedData.telephone}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                </div>
                <div className='form-group'>
                    <label>
                        Association:
                    </label>
                    <input
                        type="text"
                        name="association"
                        value={modifiedData.association}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                </div>
                <div className='form-group'>
                    <label>
                        Taille T-Shirt:
                    </label>
                    <select
                        className='select-element-mu'
                        name="tshirt"
                        value={modifiedData.tshirt}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                        <option value="XXXXL">XXXXL</option>
                        <option value="XXXXXL">XXXXXL</option>
                        <option value="XXXXXXL">XXXXXXL</option>
                        <option value="S(American)">S(American)</option>
                        <option value="M(American)">M(American)</option>
                        <option value="L(American)">L(American)</option>
                        <option value="XL(American)">XL(American)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label>
                        Vegan:
                    </label>
                    <select
                        className='select-element-mu'
                        name="vegan"
                        value={modifiedData.vegan}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    >
                        <option value={true}>Oui</option>
                        <option value={false}>Non</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label>
                        Hebergement:
                    </label>
                    <select
                        className='select-element-mu'
                        name="hebergement"
                        value={modifiedData.hebergement}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    >
                        <option value={"oui"}>Oui</option>
                        <option value={"non"}>Non</option>
                    </select>
                </div>
            </div>

            <div style={{ color: 'green', marginBottom: '20px', width: '400px' }}>
                {message}
            </div>

            <button className="send-button-mu" style={{ marginRight: '10px' }} onClick={() => navigate('/change-password')}>
                Changer Mot de Passe
            </button>

            {!isEditMode && <button className="send-button-mu" onClick={handleEditClick}>Edit</button>}
            {isEditMode && <button className="send-button-mu" onClick={handleConfirmClick}>Confirm</button>}
        </div>
    );
};

export default Profile;
