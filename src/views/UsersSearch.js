import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const USER_URL = "/users"

const UsersSearch = () => {

    const axiosPrivate = useAxiosPrivate();

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axiosPrivate.get(USER_URL);
            setUsers(response.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        console.log(users);
    }, [users])

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className="content">
            <h1>Users</h1>
        </div>
    )
}

export default UsersSearch