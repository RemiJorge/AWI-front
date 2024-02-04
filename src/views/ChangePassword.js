import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ChangePassword = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setError('Mots de Passe ne correspondent pas');
        } else {
            try {
                // send password to the server
                // if the server returns 200, set successMessage to true
                const response = await axiosPrivate.put('/auth/change-password', { password });
                if (response.status === 200) {
                    setSuccessMessage(true);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    };

    const handleGoToProfile = () => {
        navigate('/profile');
    };

    return (
        <div>
            <h2>Changer Mot de Passe</h2>

            {!successMessage && (
                <div>
                    <div className='form-group'>
                        <label>
                            Entrer Nouveau Mot de Passe:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>
                            Confirmer Nouveau Mot de Passe:
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button className="send-button-mu" onClick={handleSubmit}>Changer Mot de Passe</button>
                </div>
            )}

            {successMessage && (
                <div>
                    <p>Mot de passe changé avec succès!</p>
                    <button className="send-button-mu" onClick={handleGoToProfile}>Go to Profile</button>
                </div>
            )}
        </div>
    );
};

export default ChangePassword;
