import { useState, useEffect} from "react";
import { Outlet } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate";


const ActiveFestival = () => {
    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [festival, setFestival] = useState(0);

    const axiosPrivate = useAxiosPrivate();

    const getFestival = async () => {
        setIsLoading(true);
        try {
            //const response = await axiosPrivate.get('/festival/active');
            const response = {data: {festival: 1}}
            console.log("festival id : " + response.data.festival);
            isMounted && setFestival(response.data.festival);
        } catch (err) {
            console.error(err);
        } finally {
            isMounted && setIsLoading(false);
        }
    }

    useEffect(() => {
        getFestival();

        return () => {
            setIsMounted(false);
        }
    }, [])

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {!isLoading && <Outlet festival={festival} />}
        </div>
    )
}

export default ActiveFestival;