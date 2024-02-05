import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const GamesList = () => {

    const axiosPrivate = useAxiosPrivate();
    const [games, setGames] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axiosPrivate.get('/file/jeux/');
                if (response.data[0].message === 'No games found') {
                    setMessage("Il n'y a pas de jeux disponibles pour l'instant");
                }
                else {
                    console.log(response.data[0].image_jeu);
                    response.data.sort((a,b) => a.nom_du_jeu.localeCompare(b.nom_du_jeu, 'en', { numeric: true }))
                    setGames(response.data)
                }
            } catch (error) {
                console.error('Error fetching games:', error.message);
            }
        };

        fetchGames();
    }, []);

    return (
        <div className="games-container-list">
            <h1>Liste des jeux</h1>
            {message && <p style={{marginTop: '20px'}}>{message}</p>}
            <ul className="games-list">
                {games.map((game) => (
                    <li key={game.jeu_id} className="game-item-list">
                        <div>
                            <h3>{game.nom_du_jeu}</h3>
                            <img src={game.image_jeu ? game.image_jeu : "https://www.festivaldujeu-montpellier.org/wp-content/uploads/2019/11/cropped-logo_FJM_FINAL_160.png"} alt="" />
                            {/* <p>{game.description}</p> */}
                            <Link to={`/jeu/${game.jeu_id}`}>
                                <button className='send-button-mu'>Details</button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GamesList;
