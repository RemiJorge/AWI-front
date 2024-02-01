import { createContext, useState } from "react";

const FestivalContext = createContext();

export const FestivalProvider = ({ children }) => {
    const [festival, setFestival] = useState({});

    return (
        <FestivalContext.Provider value={{ festival, setFestival }}>
            {children}
        </FestivalContext.Provider>
    );
};

export default FestivalContext;