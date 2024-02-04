import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const REGISTER_URL = '/auth/signup';

const Register = () => {
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const mailRef = useRef();
    const errRef = useRef();

    const [page, setPage] = useState(1);

    const [mail, setMail] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [tShirtSize, setTShirtSize] = useState('M');
    const [vegan, setVegan] = useState(false);
    const [accomodation, setAccomodation] = useState("oui");
    const [association, setAssociation] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        mailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handlePage = (index) => {
        setPage(index);
    }

    const handleChangePhone = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setPhone(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        try {
            const response = await axios.post(REGISTER_URL,
                {"username": user,
                "password": pwd,
                "email": mail,
                "nom": name,
                "prenom": firstname,
                "telephone": phone,
                "tshirt": tShirtSize,
                "vegan": vegan,
                "hebergement": accomodation,
                "association": association},
                config
            );
            setUser('');
            setPwd('');
            setMail('');
            navigate('/login');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Pas de réponse du serveur');
            } else if (err.response?.status === 409) {
                setErrMsg("Nom d'utilisateur déjà utilisé");
            } else {
                setErrMsg('Connexion échouée');
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    return (

        <div className="content login-form">
            <h1>Inscrivez-vous</h1>
            <form onSubmit={handleSubmit}>
                {page === 1 ? <>
                    <div className='form-group'>
                        <label htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="email"
                            ref={mailRef}
                            autoComplete="off"
                            onChange={(e) => setMail(e.target.value)}
                            value={mail}
                            required
                            />
                    </div>


                    <div className='form-group'>
                        <label htmlFor="username">Surnom</label>
                        <input
                            type="text"
                            id="username2"
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                    </div>

                </> : <>
                
                <div className='form-group'>
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="firstname">Prénom</label>
                    <input
                        type="text"
                        id="firstname"
                        onChange={(e) => setFirstname(e.target.value)}
                        value={firstname}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="phone">Téléphone</label>
                    <input
                        type="text"
                        id="phone"
                        onChange={(e) => handleChangePhone(e)}
                        value={phone}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="tshirtsize">Taille de T-shirt</label>
                    <select
                        id="tshirtsize"
                        onChange={(e) => setTShirtSize(e.target.value)}
                        className='select-element-mu'
                        value={tShirtSize}
                        required
                    >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>

                <div className='form-group-checkbox'>
                    <input
                        type="checkbox"
                        id="vegan"
                        className='checkbox-mu'
                        onChange={(e) => setVegan(e.target.checked)}
                        checked={vegan}
                    />
                    <label htmlFor="vegan">Végétarien</label>
                </div>

                <div className='form-group'>
                    <label htmlFor="accomodation">Avez vous besoin d'un hébergement ?</label>
                    <select
                        id="accomodation"
                        onChange={(e) => setAccomodation(e.target.value)}
                        value={accomodation}
                        className='select-element-mu'
                        required
                    >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor="association">Association</label>
                    <input
                        type="text"
                        id="association"
                        onChange={(e) => setAssociation(e.target.value)}
                        value={association}
                    />
                </div>
                </>
            }

                
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                {page === 1 ? 
                    <button onClick={() => handlePage(2)}>Suivant</button> 
                    : <>
                        <button onClick={() => handlePage(1)}>Précédent</button>
                        <button type="submit">Inscription</button>
                    </>
                }
                <div className="persistCheck form-group-checkbox ">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label htmlFor="persist">Se souvenir de moi</label>
                </div>
            </form>
            <p>
                Déjà un compte ?
                <br />
                <span className="line">
                    <Link to="/login">Connectez-vous</Link>
                </span>
            </p>
        </div>

    )
}

export default Register
