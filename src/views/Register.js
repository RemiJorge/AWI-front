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

    const [mail, setMail] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        mailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        try {
            const response = await axios.post(REGISTER_URL,
                {"username": user, "password": pwd, "email": mail},
                config
            );
            setUser('');
            setPwd('');
            setMail('');
            navigate("/login");
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
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <button>Sign In</button>
                <div className="persistCheck">
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
