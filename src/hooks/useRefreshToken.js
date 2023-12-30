import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/auth/refresh-token', {}, {
            withCredentials: true
        });
        console.log("useRefreshToken: " + JSON.stringify(response.data));
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.access_token);
            return {
                ...prev,
                roles: response.data.roles,
                accessToken: response.data.access_token
            }
        });
        return response.data.access_token;
    }
    return refresh;
};

export default useRefreshToken;
