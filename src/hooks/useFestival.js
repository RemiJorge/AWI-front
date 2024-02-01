import { useContext } from "react";
import FestivalContext from "../context/FestivalProvider"

const useFestival = () => {
    const { festival, setFestival } = useContext(FestivalContext);

    return { festival, setFestival };
}

export default useFestival;