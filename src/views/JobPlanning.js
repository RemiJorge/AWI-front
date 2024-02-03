import { useState, useEffect } from "react";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const JobPlanning = () => {

    const [festival, setFestival] = useState({});
    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const controller = new AbortController();

    // raw data
    const [jobs, setJobs] = useState({});
    // transformed data for display
    const [dataTransformed, setDataTransformed] = useState([]);
    // raw data for animation
    const [animations, setAnimations] = useState({});
    // transformed data for display
    const [animationsTransformed, setAnimationsTransformed] = useState([]);
    // true if the user is currently registering
    const [isRegistering, setIsRegistering] = useState(false);
    // day selected for registration (one day at a time)
    const [inscriptionDay, setInscriptionDay] = useState("");
    // list of inscriptions for the selected day to display
    const [inscriptionsDisplay, setInscriptionsDisplay] = useState([]);
    // true if the user has selected multiple inscriptions for the same day (flexible)
    const [multipleInscriptions, setMultipleInscriptions] = useState(false);
    // true if show animation
    const [showAnimation, setShowAnimation] = useState(false);
    // day of the animation
    const [animationDay, setAnimationDay] = useState("");
    // creneau where the user can register for the animation
    const [animationCreneau, setAnimationCreneau] = useState([]);
    // list of inscriptions for animation for the selected day to display
    const [inscriptionsAnimationDisplay, setInscriptionsAnimationDisplay] = useState([]);
    // show error message
    const [statusLabelAnimation, setStatusLabelAnimation] = useState("");
    const axiosPrivate = useAxiosPrivate();


    const getJobs = async () => {
        try {
            const response = await axiosPrivate.get(`/inscription/poste?festival_id=${festival.festival_id}`, { signal: controller.signal });
            console.log("jobs: " + response.data);
            isMounted && setJobs(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            isMounted && setIsLoading(false);
        }
    }

    const getAnimation = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.get(`/inscription/zone-benevole?festival_id=${festival.festival_id}`, { signal: controller.signal });
            console.log("animations: " + response.data);
            isMounted && setAnimations(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            isMounted && setIsLoading(false);
        }
    }

    const fetchFestival = async () => {
        try {
            const response = await axiosPrivate.get('/festival/active');
            if (response.status === 200) {
                setFestival(response.data);
                return true;
            } else {
                console.log("Erreur lors de la récupération du festival actif");
                setFestival({});
                isMounted && setIsLoading(false);
                return false;
            }
        }
        catch (err) {
            console.error(err);
            return false;
        } 
    }

    useEffect(() => {

        fetchFestival();
        return () => {
            setIsMounted(false);
            controller.abort();
        }
    }, [])

    useEffect(() => {
        if (festival && Object.keys(festival).length > 0) {
            getJobs();
            getAnimation();
        } else {
            setIsLoading(false);
        }

    }, [festival])


    useEffect(() => {
        if (!jobs || Object.keys(jobs).length <= 0) return;

        const data = jobs.reduce((acc, job) => {
            const { jour, poste, creneau, nb_inscriptions, is_register } = job;

            const dayIndex = acc.findIndex(item => item.day === jour);

            if (dayIndex === -1) {
                acc.push({
                    day: jour,
                    creneaux: [creneau],
                    postes: [poste],
                    data: { [poste]: { [creneau]: nb_inscriptions } },
                    my_inscriptions: is_register ? [{poste: poste, creneau: creneau}] : []
                });
            } else {
                const creneauIndex = acc[dayIndex].creneaux.indexOf(creneau);
                if (creneauIndex === -1) {
                    acc[dayIndex].creneaux.push(creneau);
                }

                const posteIndex = acc[dayIndex].postes.indexOf(poste);
                if (posteIndex === -1) {
                    acc[dayIndex].postes.push(poste);
                }

                acc[dayIndex].data[poste] = acc[dayIndex].data[poste] || {};
                acc[dayIndex].data[poste][creneau] = nb_inscriptions;
                if (is_register) {
                    acc[dayIndex].my_inscriptions.push({poste: poste, creneau: creneau});
                }

            }

            return acc;
        }, []);

        // sort the postes
        data.map(item => item.postes.sort());

        setDataTransformed(data);

    }, [jobs])


    const getEspace = (animation) => {
        return (animation.zone_benevole_name === "") ? animation.zone_plan : animation.zone_benevole_name;
    }

    useEffect (() => {
        if (!animations || Object.keys(animations).length <= 0) return;

        const data = animations.reduce((acc, animation) => {
            const { jour, poste, creneau, nb_inscriptions, is_register, zone_plan, zone_benevole_name, zone_benevole_id } = animation;

            const dayIndex = acc.findIndex(item => item.day === jour);
            const espace = getEspace(animation);

            if (dayIndex === -1) {
                acc.push({
                    day: jour,
                    creneaux: [creneau],
                    zones : [espace],
                    data: { [espace]: { [creneau]: animation } },
                    my_inscriptions: is_register ? [{...animation, zone: espace}] : []
                });
            } else {
                const creneauIndex = acc[dayIndex].creneaux.indexOf(creneau);
                if (creneauIndex === -1) {
                    acc[dayIndex].creneaux.push(creneau);
                }

                const zoneIndex = acc[dayIndex].zones.indexOf(espace);
                if (zoneIndex === -1) {
                    acc[dayIndex].zones.push(espace);
                }

                acc[dayIndex].data[espace] = acc[dayIndex].data[espace] || {};
                acc[dayIndex].data[espace][creneau] = animation;
                if (is_register) {
                    acc[dayIndex].my_inscriptions.push({...animation, zone: espace});
                }

            }

            return acc;
        }, []);

        // sort the zones
        data.map(item => item.zones.sort());

        setAnimationsTransformed(data);

    }, [animations])


    const handleMenuInscription = (day) => {
        setIsRegistering(true);
        setInscriptionDay(day);
        const my_inscriptions = dataTransformed.find(item => item.day === day).my_inscriptions;
        if (!showAnimation) {
            const data = []
            my_inscriptions.map(item => data.push({ "festival_id": festival.festival_id, "poste": item.poste, "jour": day, "creneau": item.creneau }));
            setInscriptionsDisplay(data);
            setMultipleInscriptions(hasMultipleInscriptions(data));
        }  else {
            const data = []
            setInscriptionsDisplay([]);
            animationsTransformed.find(item => item.day === day).my_inscriptions.map(item => data.push(item));
            setInscriptionsAnimationDisplay(data);
        }
    }

    const handleCancelInscription = () => {
        setIsRegistering(false);
        setInscriptionDay("");
        setInscriptionsDisplay([]);
        setMultipleInscriptions(false);
        setShowAnimation(false);
        setAnimationDay("");
        setAnimationCreneau([]);
        setInscriptionsAnimationDisplay([]);
    }


    const hasMultipleInscriptions = (list_inscriptions) => {
        const list = list_inscriptions.map(item => item.jour + item.creneau);
        return new Set(list).size !== list.length;
    }


    const handleInscription = (day, poste, creneau) => {
        if (inscriptionsDisplay.find(item => item.poste === poste && item.jour === day && item.creneau === creneau)) {
            // remove inscription
            setMultipleInscriptions(hasMultipleInscriptions(inscriptionsDisplay.filter(item => item.poste !== poste || item.jour !== day || item.creneau !== creneau)));
            setInscriptionsDisplay(inscriptionsDisplay.filter(item => item.poste !== poste || item.jour !== day || item.creneau !== creneau))
        } else {
            // add inscription
            inscriptionsDisplay.find(item => item.creneau === creneau && item.jour === day && item.poste !== poste) && setMultipleInscriptions(true);
            setInscriptionsDisplay([...inscriptionsDisplay, { "festival_id": festival.festival_id, "poste": String(poste), "jour": String(day), "creneau": String(creneau) }]);
        } 
    }

    const handleAnimationInscription = (animation) => {
        let data = inscriptionsAnimationDisplay;
        if (inscriptionsAnimationDisplay.find(item => item.creneau === animation.creneau)) {
            // remove inscription
            data = inscriptionsAnimationDisplay.filter(item => item.creneau !== animation.creneau);
        }
        setInscriptionsAnimationDisplay([...data, animation]);
    }

    const handleShowPoste = (day) => {
        setShowAnimation(false);
        setAnimationDay("");
        setAnimationCreneau([]);
        setInscriptionsAnimationDisplay([]);
    }

    const handleShowAnimation = (day) => {
        setShowAnimation(true);
        setAnimationDay(day);
        const animCreneaux = []
        if (dataTransformed.find(item => item.day === day).my_inscriptions.length > 0) {
            dataTransformed.find(item => item.day === day).my_inscriptions.map(item => {
                if (item.poste.includes("Animation")) {
                    animCreneaux.push(item.creneau);
                }
            });
        }
        setAnimationCreneau(animCreneaux);
        console.log(animationsTransformed)
        const data = []
        animationsTransformed.find(item => item.day === day).my_inscriptions.map(item =>
            data.push(item)
        );
        setInscriptionsAnimationDisplay(data);
    }


    const sendInscriptionPoste = async () => {
        try {
            const my_inscriptions = dataTransformed.find(item => item.day === inscriptionDay).my_inscriptions;
            // add inscriptions
            const inscriptions = []
            inscriptionsDisplay.map(item => {
                if (!my_inscriptions.find(inscription => inscription.poste === item.poste && inscription.creneau === item.creneau)) {
                    inscriptions.push({ "festival_id": festival.festival_id, "poste": item.poste, "jour": item.jour, "creneau": item.creneau });
                }
            });

            // remove inscriptions
            const desinscriptions = []
            my_inscriptions.map(item => {
                if (!inscriptionsDisplay.find(inscription => inscription.poste === item.poste && inscription.creneau === item.creneau)) {
                    desinscriptions.push({ "festival_id": festival.festival_id, "poste": item.poste, "jour": inscriptionDay, "creneau": item.creneau });
                }
            });

            const data = {
                "inscriptions": inscriptions,
                "desinscriptions": desinscriptions
            }
            const jsonData = JSON.stringify(data);
            const response = await axiosPrivate.post('/inscription/poste/batch-inscription', jsonData);
            console.log(response.data);

            if (response.status === 200) {
                console.log("Inscription réussie");
            } else {
                console.log("Inscription échouée");
            }

        } catch (err) {
            console.error(err);
        } finally {
            // TODO : quand le bug sera corrigé, il faut revoir les lignes suivantes
            setIsRegistering(false);
            setInscriptionDay("");
            setInscriptionsDisplay([]);
            getJobs();
        }
    }

    const canSubmitAnimation = () => {
        let result = true;
        // check if all creneau has an inscription
        animationCreneau.map(creneau => {
            let data = inscriptionsAnimationDisplay.find(item => item.creneau === creneau);
            if (!data) {
                result = false;
            }
        });
        return result;
    }


    const sendInscriptionAnimation = async () => {
        try {
            const my_inscriptions = animationsTransformed.find(item => item.day === animationDay).my_inscriptions;
            // add inscriptions
            const inscriptions = []
            inscriptionsAnimationDisplay.map(item => {
                if (!my_inscriptions.find(inscription => inscription.zone === item.zone && inscription.creneau === item.creneau)) {
                    inscriptions.push(item);
                }
            });

            // remove inscriptions
            const desinscriptions = []
            my_inscriptions.map(item => {
                if (!inscriptionsAnimationDisplay.find(inscription => inscription.zone === item.zone && inscription.creneau === item.creneau)) {
                    desinscriptions.push(item);
                }
            });

            const data = {
                "inscriptions": inscriptions,
                "desinscriptions": desinscriptions
            }
            console.log("data:" +  data);
            const jsonData = JSON.stringify(data);
            const response = await axiosPrivate.post('/inscription/zone-benevole/batch-inscription', jsonData);
            console.log(response.data);

            if (response.status === 200) {
                console.log("Inscription réussie");
            } else {
                console.log("Inscription échouée");
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsRegistering(false);
            setInscriptionDay("");
            setInscriptionsDisplay([]);
            getAnimation();
        }
    }





    const handleSubmitInscription = async () => {
        const my_inscriptions = dataTransformed.find(item => item.day === inscriptionDay).my_inscriptions;
        // add inscriptions
        const inscriptions = []
        inscriptionsDisplay.map(item => {
            if (!my_inscriptions.find(inscription => inscription.poste === item.poste && inscription.creneau === item.creneau)) {
                inscriptions.push({ "festival_id": festival.festival_id, "poste": item.poste, "jour": item.jour, "creneau": item.creneau });
            }
        });

        // si inscriptions contient des postes= Animations
        if (animationsTransformed.length > 0 && inscriptions.find(item => item.poste.includes("Animation"))){
            setShowAnimation(true)
            setAnimationDay(inscriptionDay);
            const animCreneaux = []
            inscriptions.map(item => {
                if (item.poste.includes("Animation")) {
                    animCreneaux.push(item.creneau);
                }
            });
            dataTransformed.find(item => item.day === inscriptionDay).my_inscriptions.map(item => {
                if (item.poste.includes("Animation")) {
                    animCreneaux.push(item.creneau);
                }
            });
            setAnimationCreneau(animCreneaux);
            const data = []
            animationsTransformed.find(item => item.day === inscriptionDay).my_inscriptions.map(item => 
                data.push(item)
            );
            setInscriptionsAnimationDisplay(data);    
            

        } else {
            sendInscriptionPoste()
        }
    }

    const handleSubmitInscriptionAnimation = async () => {
        if (!canSubmitAnimation()) {
            setStatusLabelAnimation("Vous devez sélectionner un créneau pour chaque animation");
        } else {
            if (inscriptionsDisplay.length > 0) {
                sendInscriptionPoste()
            }
            sendInscriptionAnimation()
            setShowAnimation(false)
            setAnimationDay("");
            setAnimationCreneau([]);
            setInscriptionsAnimationDisplay([]);
        }
    }


    return (
        <div className="content ">
            <h1>Planning des Postes</h1>
            {isLoading ? <p>Loading...</p>
            : ( !festival || Object.keys(festival).length <= 0 ? <p>Pas de festival actif en cours</p>
                : 
                (dataTransformed?.length
                    ? (
                        <> { dataTransformed.map((day, i) => (
                                <div key={i} className="planning-day">
                                    <div className="planning-day-header">
                                        <h2>{day.day}</h2>
                                        { !isRegistering ? <>
                                            <button onClick={() => handleMenuInscription(day.day)}>S'inscrire</button>
                                            {showAnimation && animationDay === day.day ? 
                                                <button onClick={() => handleShowPoste(day.day)}>Voir les postes</button>
                                                : animationsTransformed.length > 0 &&
                                                <button onClick={() => handleShowAnimation(day.day)}>Voir les animations</button>
                                            }
                                        </>
                                        : inscriptionDay === day.day && <>
                                            <button onClick={() => handleCancelInscription()}>Annuler</button>
                                            { showAnimation && animationDay === day.day ?
                                             <button onClick={() => handleSubmitInscriptionAnimation()}>Terminer</button>
                                            : <button onClick={() => handleSubmitInscription()}>Valider</button>
                                            }
                                        </>
                                        }
                                    </div>
                                    { !showAnimation || animationDay !== day.day ? <>

                                        {isRegistering && inscriptionDay === day.day && multipleInscriptions &&
                                            <div className="alert-multi-inscription">
                                                <p>Vous avez sélectionné plusieurs postes pour le même créneau !</p>
                                                <p>Vous êtes flexible : un admin choisira pour vous l'un des postes sélectionnés.</p>
                                            </div>
                                        }

                                        <table className={isRegistering ? (
                                            inscriptionDay === day.day ?
                                            "planning-table-registering"
                                            : "planning-table-disabled") : ""
                                        }>
                                            <thead>
                                                <tr>
                                                    <th>Poste</th>
                                                    {day.creneaux.map((creneau, i) => <th key={i}>{creneau}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {day.postes.map((poste, i) => (
                                                    <tr key={i}>
                                                        <td className="row-title">{poste}</td>
                                                        {day.creneaux.map((creneau, i) => (
                                                            <td key={i}
                                                            className="row-number"
                                                            onClick={isRegistering && inscriptionDay === day.day ? () => handleInscription(day.day, poste, creneau) : null}
                                                            >
                                                                    <div className={
                                                                        (isRegistering && inscriptionDay === day.day ? (
                                                                        inscriptionsDisplay.find(item => item.poste === poste && item.jour === day.day && item.creneau === creneau)
                                                                        ? "cell cell-selected" : "cell")
                                                                        : (day.my_inscriptions.find(item => item.poste === poste && item.creneau === creneau) ? "cell cell-registered"
                                                                        : "cell")
                                                                        )}>
                                                                        {(day.data[poste]?.[creneau] >= 0) ? day.data[poste]?.[creneau] : "/"}
                                                                    </div>
                                                            
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </> : 
                                        (animationsTransformed.length <= 0 || animationsTransformed.filter(item => item.day === day.day).length <= 0) ? <p>No animation to display</p>
                                        : <>
                                        {statusLabelAnimation !== "" && <div className="alert-multi-inscription">{statusLabelAnimation}</div>}
                                        {animationsTransformed.filter(item => item.day === day.day).map((animation, i) =>
                                            <table className={isRegistering ? (
                                                inscriptionDay === day.day ?
                                                "planning-table-registering"
                                                : "planning-table-disabled") : ""
                                            }
                                            key={i}>
                                                <thead>
                                                    <tr>
                                                    <th>Animation</th>
                                                    {animation.creneaux.map((creneau, i) => <th key={i}>{creneau}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {animation.zones.map((zone, i) => (
                                                        <tr key={i}>
                                                            <td className="row-title">{zone}</td>
                                                            {animation.creneaux.map((creneau, i) => (
                                                                <td key={i}
                                                                className="row-number"
                                                                onClick={isRegistering && inscriptionDay === day.day && animationCreneau.includes(creneau)
                                                                    ? () => handleAnimationInscription({...animation.data[zone]?.[creneau], zone: zone, creneau: creneau})
                                                                    : null }
                                                                >
                                                                    <div className={
                                                                        isRegistering && inscriptionDay === day.day ? (
                                                                            inscriptionsAnimationDisplay.find(item => item.zone === zone && item.creneau === creneau) ? "cell cell-selected" 
                                                                            : ((animationCreneau.includes(creneau) ? "cell" : "cell-disabled" ))
                                                                        ) : (
                                                                            "cell" +
                                                                            (animation.my_inscriptions.find(item => item.zone === zone && item.creneau === creneau) ? " cell-registered" : "")
                                                                        )}>
                                                                        {(animation.data[zone]?.[creneau]?.nb_inscriptions >= 0) ? animation.data[zone]?.[creneau]?.nb_inscriptions : "/"}
                                                                    </div>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </>}
                                </div>
                            ))}
                            </>
                            )
                    : <p>No jobs to display</p>
                )
            )
            }
        </div>
    )
}

export default JobPlanning