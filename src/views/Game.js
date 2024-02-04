import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const GameDetails = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { jeu_id } = useParams();
    const [gameDetails, setGameDetails] = useState(null);
    const [festival_id, setFestivalId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGameDetails = async () => {

            try {

                const festival = await axiosPrivate.get('/festival/active');
                setFestivalId(festival.data.festival_id);
                const to_send = {
                    festival_id: festival.data.festival_id,
                    game_id: jeu_id
                }
                const response = await axiosPrivate.post(`/file/jeux`, to_send);
                console.log(response);
                if (response.data.message === 'No game found') {
                    console.log('No game found');
                    setMessage('Aucun jeu trouvé');
                }
                setGameDetails(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGameDetails();
    }, [jeu_id]);

    if (!gameDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {message ? <p style={{marginTop: '20px'}}>{message}</p> : 
            <div className="game-details-container">
                <h2 className='h2-game'>{gameDetails.nom_du_jeu}</h2>
                <img className='img-game' src={gameDetails.image_jeu} alt="Game Cover" />
                <div style={{ textAlign: 'left' }}>
                <p className='p-game'><strong>Auteur:</strong> {gameDetails.auteur}</p>
                <p className='p-game'><strong>Éditeur:</strong> {gameDetails.editeur}</p>
                <p className='p-game'><strong>Nombre de Joueurs:</strong> {gameDetails.nb_joueurs}</p>
                <p className='p-game'><strong>Âge Minimum:</strong> {gameDetails.age_min}</p>
                <p className='p-game'><strong>Durée:</strong> {gameDetails.duree}</p>
                <p className='p-game'><strong>Type de Jeu:</strong> {gameDetails.type_jeu}</p>
                <p className='p-game'><strong>Zone:</strong> {gameDetails.zone_plan}</p>
                {/* <p className='p-game'><strong>Zone Bénévole:</strong> {gameDetails.zone_benevole}</p> */}
                {/* <p className='p-game'><strong>A Animer:</strong> {gameDetails.a_animer}</p> */}
                <p className='p-game'><strong>Reçu:</strong> {gameDetails.recu}</p>
                <p className='p-game'><strong>Mécanismes:</strong> {gameDetails.mecanismes}</p>
                <p className='p-game'><strong>Thèmes:</strong> {gameDetails.themes}</p>
                <p className='p-game'><strong>Description:</strong> {gameDetails.description}</p>
                </div>

                <a className='a-game' href={gameDetails.notice} target="_blank" rel="noopener noreferrer">Voir la notice</a>

                <div className="tags-container">
                    <strong>Tags:</strong> {gameDetails.tags.split(',').map(tag => <span key={tag}>{tag.trim()} </span>)}
                </div>

                <div className="video-container">
                    <strong>Video:</strong> <a className='a-game' href={gameDetails.video} target="_blank" rel="noopener noreferrer">Regarder la vidéo</a>
                </div>
            </div>
            }
        </div>
    );
};

export default GameDetails;
