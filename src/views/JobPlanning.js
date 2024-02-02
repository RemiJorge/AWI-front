import { useState, useEffect } from "react";
import useFestival from "../hooks/useFestival";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const JobPlanning = () => {

    const { festival } = useFestival();
    const festivalID = festival.festival_id;
    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
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
    const axiosPrivate = useAxiosPrivate();


    const getJobs = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.get(`/inscription/poste?festival_id=${festivalID}`, { signal: controller.signal });
            console.log(response.data);
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
            const response = await axiosPrivate.get(`/inscription/zone-benevole?festival_id=${festivalID}`, { signal: controller.signal });
            console.log(response.data);
            isMounted && setAnimations(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            isMounted && setIsLoading(false);
        }
    }


    useEffect(() => {

        getJobs();
        getAnimation();
        console.log("festival recu : " + festival.festival_id);
        return () => {
            setIsMounted(false);
            controller.abort();
        }
    }, [])


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

        setDataTransformed(data);

        console.log(data);
    }, [jobs])

/*

    useEffect = (() => {
        if (!animations || Object.keys(animations).length <= 0) return;

        const data = animations.reduce((acc, animation) => {
            const { jour, poste, creneau, nb_inscriptions, is_register, zone_plan, zone_benevole_name, zone_benevole_id } = animation;

            const dayIndex = acc.findIndex(item => item.day === jour);

            if (dayIndex === -1) {
                acc.push({
                    day: jour,
                    creneaux: [creneau],
                    zones : [zone_benevole_name],
                    data: { [zone_benevole_name]: { [creneau]: animation } },
                    my_inscriptions: is_register ? [{zone: zone_benevole_name, creneau: creneau}] : []
                });
            } else {
                const creneauIndex = acc[dayIndex].creneaux.indexOf(creneau);
                if (creneauIndex === -1) {
                    acc[dayIndex].creneaux.push(creneau);
                }

                const zoneIndex = acc[dayIndex].zones.indexOf(zone_benevole_name);
                if (zoneIndex === -1) {
                    acc[dayIndex].zones.push(zone_benevole_name);
                }

                acc[dayIndex].data[zone_benevole_name] = acc[dayIndex].data[zone_benevole_name] || {};
                acc[dayIndex].data[zone_benevole_name][creneau] = animation;
                if (is_register) {
                    acc[dayIndex].my_inscriptions.push({zone: zone_benevole_name, creneau: creneau});
                }

            }

            return acc;
        }, []);

        setAnimationsTransformed(data);

        console.log(data);
    }, [animations])
*/

    useEffect(() => {
        console.log("dataTransformed: " + typeof dataTransformed );
    }, [dataTransformed])

    useEffect(() => {
        console.log("inscriptionsDisplay: " + JSON.stringify(inscriptionsDisplay));
    }, [inscriptionsDisplay])

    const handleMenuInscription = (day) => {
        setIsRegistering(true);
        setInscriptionDay(day);
        const my_inscriptions = dataTransformed.find(item => item.day === day).my_inscriptions;
        const data = []
        my_inscriptions.map(item => data.push({ "festival_id": festivalID, "poste": item.poste, "jour": day, "creneau": item.creneau }));
        setInscriptionsDisplay(data);
        setMultipleInscriptions(hasMultipleInscriptions(data));
    }

    const handleCancelInscription = () => {
        setIsRegistering(false);
        setInscriptionDay("");
        setInscriptionsDisplay([]);
        setMultipleInscriptions(false);
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
            setInscriptionsDisplay([...inscriptionsDisplay, { "festival_id": festivalID, "poste": String(poste), "jour": String(day), "creneau": String(creneau) }]);
        } 

    }

    const handleSubmitInscription = async () => {
        try {
            const my_inscriptions = dataTransformed.find(item => item.day === inscriptionDay).my_inscriptions;
            // add inscriptions
            const inscriptions = []
            inscriptionsDisplay.map(item => {
                if (!my_inscriptions.find(inscription => inscription.poste === item.poste && inscription.creneau === item.creneau)) {
                    inscriptions.push({ "festival_id": festivalID, "poste": item.poste, "jour": item.jour, "creneau": item.creneau });
                }
            });
            // remove inscriptions
            const desinscriptions = []
            my_inscriptions.map(item => {
                if (!inscriptionsDisplay.find(inscription => inscription.poste === item.poste && inscription.creneau === item.creneau)) {
                    desinscriptions.push({ "festival_id": festivalID, "poste": item.poste, "jour": inscriptionDay, "creneau": item.creneau });
                }
            });

            const data = {
                "inscriptions": inscriptions,
                "desinscriptions": desinscriptions
            }
            console.log("data:" +  data);
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

    return (
        <div className="content ">
            <h1>Planning des Postes</h1>
            {isLoading ? <p>Loading...</p>
            :
                (dataTransformed?.length
                    ? (
                        <>
                            {dataTransformed.map((day, i) => (
                                <div key={i} className="planning-day">
                                    <div className="planning-day-header">
                                        <h2>{day.day}</h2>
                                        { !isRegistering ?
                                        <button onClick={() => handleMenuInscription(day.day)}>S'inscrire</button>
                                        : inscriptionDay === day.day && <>
                                            <button onClick={() => handleCancelInscription()}>Annuler</button>
                                            <button onClick={() => handleSubmitInscription()}>Valider</button>
                                        </>
                                        }
                                    </div>
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
                                </div>
                            ))}
                            </>
                            )
                    : <p>No jobs to display</p>
                )

            }
        </div>
    )
}

export default JobPlanning