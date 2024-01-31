import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const JobPlanning = () => {

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const controller = new AbortController();

    const [jobs, setJobs] = useState({});
    const [dataTransformed, setDataTransformed] = useState([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [inscriptionDay, setInscriptionDay] = useState("");
    const [inscriptions, setInscriptions] = useState([]);
    const [multipleInscriptions, setMultipleInscriptions] = useState(false);
    const [desinscriptions, setDesinscriptions] = useState([]);
    const [festivalID, setFestivalID] = useState(1);
    const axiosPrivate = useAxiosPrivate();


    const getJobs = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.get('/inscription/poste', {
                signal: controller.signal
            });
            console.log(response.data);
            isMounted && setJobs(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            isMounted && setIsLoading(false);
        }
    }


    useEffect(() => {

        getJobs();

        return () => {
            setIsMounted(false);
            controller.abort();
        }
    }, [])


    useEffect(() => {
        if (!jobs || Object.keys(jobs).length <= 0) return;

        setFestivalID(jobs[0].festival_id);

        const data = jobs.reduce((acc, job) => {
            const { jour, poste, creneau, nb_inscriptions } = job;

            const dayIndex = acc.findIndex(item => item.day === jour);

            if (dayIndex === -1) {
                acc.push({
                    day: jour,
                    creneaux: [creneau],
                    postes: [poste],
                    data: { [poste]: { [creneau]: nb_inscriptions } }
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
            }

            return acc;
        }, []);

        setDataTransformed(data);

        console.log(data);
    }, [jobs])


    useEffect(() => {
        console.log("dataTransformed: " + typeof dataTransformed );
    }, [dataTransformed])

    useEffect(() => {
        console.log("inscriptions: " + JSON.stringify(inscriptions));
    }, [inscriptions])

    const handleMenuInscription = (day) => {
        setIsRegistering(true);
        setInscriptionDay(day);
        setInscriptions([]); // TODO : mettre à jour avec les inscriptions de la journée
        setDesinscriptions([]);
        setMultipleInscriptions(false);
    }

    const handleCancelInscription = () => {
        setIsRegistering(false);
        setInscriptionDay("");
        setInscriptions([]);
        setDesinscriptions([]);
        setMultipleInscriptions(false);
    }


    const hasMultipleInscriptions = (list_inscriptions) => {
        const list = list_inscriptions.map(item => item.jour + item.creneau);
        return new Set(list).size !== list.length;
    }


    const handleInscription = (day, poste, creneau) => {
        if (inscriptions.find(item => item.poste === poste && item.jour === day && item.creneau === creneau)) {
            setMultipleInscriptions(hasMultipleInscriptions(inscriptions.filter(item => item.poste !== poste || item.jour !== day || item.creneau !== creneau)));
            setInscriptions(inscriptions.filter(item => item.poste !== poste || item.jour !== day || item.creneau !== creneau))
         } else {
            inscriptions.find(item => item.creneau === creneau && item.jour === day && item.poste !== poste) && setMultipleInscriptions(true);
            setInscriptions([...inscriptions, { "festival_id": festivalID, "poste": String(poste), "jour": String(day), "creneau": String(creneau) }]);
         } 

    }

    const handleSubmitInscription = async () => {
        try {
            const data = {
                "inscriptions": inscriptions,
                "desinscriptions": desinscriptions
            }
            console.log(data);
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
            setInscriptions([]);
            setDesinscriptions([]);
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
                                                                    (isRegistering && inscriptionDay === day.day &&
                                                                    inscriptions.find(item => item.poste === poste && item.jour === day.day && item.creneau === creneau) ?
                                                                    "cell cell-selected"
                                                                    : "cell"
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