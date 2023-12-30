import { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const FILE_URL = "/file"

const Admin = () => {

    const axiosPrivate = useAxiosPrivate();

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Choisir un fichier");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        const name = e.target.files[0]?.name;
        name ? setFileName(name) : setFileName("Choisir un fichier");
    }

    const handleFileUpload = async () => {
        try{

            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            };
            const response = await axiosPrivate.post(FILE_URL, formData, config);
            console.log(response);
        }
        catch(err){
            console.log(err);
        } finally {
            setFile(null);
            setFileName("Choisir un fichier");
        }
    }

    return (
        <div className="content">
            <h1>Admin</h1>
            <p>Charger un fichier de type CSV</p>
            <div className="upload-file">
                <input 
                    type="file"
                    id = "filecsv"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                <label htmlFor="filecsv">{fileName}</label>
                {file &&
                    <button onClick={handleFileUpload}>Upload</button>
                }
            </div>
        </div>
    )
}

export default Admin