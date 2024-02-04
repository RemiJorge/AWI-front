import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useLogout from '../hooks/useLogout';

const DeleteAccount = () => {

    const axiosPrivate = useAxiosPrivate();
    const logout = useLogout();
    const [confirmationCount, setConfirmationCount] = useState(0);


    const handleDeleteClick = async (confirmationCount) => {
        // Increase the confirmation count on each click
        setConfirmationCount(confirmationCount + 1);
        if (confirmationCount + 1 === 2) {
            try {
                // Send delete request
                console.log('Sending delete request');
                //await axiosPrivate.delete('/users/delete-data');
            }
            catch (err) {
                console.error(err);
            }
            setConfirmationCount(0);
            await logout();
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', maxWidth: '500px', marginTop: '80px' }}>
                Nous prenons la protection de vos données très au sérieux. Si vous
                souhaitez supprimer votre compte, veuillez noter que toutes vos données
                seront supprimées de manière permanente. Ceci est conforme à la
                réglementation RGPD.
            </div>
            <button className='rgpd-button' onClick={() => handleDeleteClick(confirmationCount)}>
                {confirmationCount === 1 ? 'Confirmer Suppression' : 'Supprimer mon compte et mes données'}
            </button>
            {confirmationCount === 1 &&
                <div style={{ marginTop: '20px', maxWidth: '500px' }}>
                    Vous êtes sur le point de supprimer votre compte. Veuillez cliquer
                    une deuxième fois pour confirmer.
                </div>
            }
        </div>
    );
};

export default DeleteAccount;
