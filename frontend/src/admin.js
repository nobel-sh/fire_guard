import React, {useEffect, useState} from 'react';
import './admin.css'; // Import the CSS file
import Button from '@mui/material/Button';
import {Dialog} from '@mui/material';
import TextField from '@mui/material/TextField';

const AdminComponent = () => {
    const [isDialogOpen, updateIsDialogOpen] = useState(false);
    const [formData, updateFormData] = useState({
        "name": "",
        "latitude": "",
        "longitude": "",
        "ip": "",
        "description": "",
        "numbers_to_sms": ""
    });
    const [currentCameras, updateCurrentCameras] = useState([]);

    const verifyData = (d) => {
        const url = `http://localhost:8000/api/incident/verify/${d}`;
        console.log(d);
        fetch(url, {
            method: 'PUT',
        })
            .then((response) => response.json())
            .then((response) => {
                fetchCameras();
                console.log("THE RESPONSE IS " + JSON.stringify(response))
            })
            .catch((error) => {
                console.log(error);
            });
    }
    // Function to filter out null locations and generate a log report
    const generateLogReport = () => {
        if (!currentCameras || currentCameras.length === 0) {
            return <p>No locations to display.</p>;
        }

        const filteredLocations = currentCameras.filter(location => location !== null);


        const logReport = [];
        for (let i = 0; i < filteredLocations.length; i++) {
            console.log(filteredLocations[i]);
            let location = filteredLocations[i];
            logReport.push(
                <tr key={i} className={location.fireStatus === 'inactive' ? 'inactive' : ''} >
                    <td>{location.name}</td>
                    <td>{location.fireStatus ? 'active' : 'inactive'}</td>
                    <td>
                        {location.incident ? (
                            <Button variant="contained" onClick={() => verifyData(location.incident._id)}>
                                Verify
                            </Button>
                        ) : (
                            "Verified"
                        )}
                    </td>
                </tr>);
        }
        return logReport;
    };


    const addZone = () => {
        updateIsDialogOpen(!isDialogOpen);
    };

    const fetchCameras = () => {
        fetch('http://localhost:8000/api/location/')
            .then((response) => response.json())
            .then((data) => {
                updateCurrentCameras(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const addCamera = () => {
        console.log(JSON.stringify(formData));
        console.log("aslfjas");
        const apiUrl = 'http://localhost:8000/api/location/';
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // You may need to adjust the content type
            },
            body: JSON.stringify(formData),
        }).then((response) => {
            console.log(response);
            if (!response.ok) {
                console.log(response);
            } else {
                updateFormData({
                    "name": "",
                    "latitude": "",
                    "longitude": "",
                    "ip": "",
                    "description": "",
                    "numbers_to_sms": ""
                });
                fetchCameras();
            }
        }).catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    useEffect(() => {
        fetchCameras();
    }, [])

    return (
        <div className="container">
            <Dialog open={isDialogOpen} onClose={addZone}>
                <div style={{padding: "12px", display: "flex", flexDirection: "column"}}>
                    <div style={{padding: '12px'}}>
                        <TextField id="outlined-basic" label="Location name" variant="outlined" onChange={(e) => {
                            updateFormData({...formData, "name": e.target.value})
                        }} value={formData["name"]} />
                    </div>
                    <div style={{padding: '12px'}}>
                        <TextField id="outlined-basic" label="Latitude" variant="outlined" onChange={(e) => {
                            updateFormData({...formData, "latitude": e.target.value})
                        }} value={formData["latitude"]} />
                    </div>
                    <div style={{padding: '12px'}}>
                        <TextField id="outlined-basic" label="Longitude" variant="outlined" onChange={(e) => {
                            updateFormData({...formData, "longitude": e.target.value})
                        }} value={formData["longitude"]} />
                    </div>
                    <div style={{padding: '12px'}}>
                        <TextField id="outlined-basic" label="IP" variant="outlined" onChange={(e) => {
                            updateFormData({...formData, "ip": e.target.value})
                        }} value={formData["ip"]} />
                    </div>
                    <div style={{padding: '12px'}}>
                        <TextField id="outlined-basic" label="Description" variant="outlined" onChange={(e) => {
                            updateFormData({...formData, "description": e.target.value})
                        }} value={formData["description"]} />
                    </div>
                    <div style={{padding: '12px'}}>
                        <TextField id="outlined-basic" label="Numbers To SMS" variant="outlined" placeholder="123,123,123" onChange={(e) => {
                            updateFormData({...formData, "numbers_to_sms": e.target.value})
                        }} value={formData["numbers_to_sms"]} />
                    </div>

                    <Button variant='contained' style={{height: "32px"}} onClick={addCamera}>Add</Button>
                </div>
            </Dialog>
            <div className="table-container">
                <div style={{display: "flex", margin: "auto", justifyContent: "space-between", alignItems: "center"}}>
                    <h1>Log Report for Locations</h1>
                    <Button variant='contained' style={{height: "32px"}} onClick={addZone}>ADD ZONE</Button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Fire Status</th>
                            <th>Verification Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateLogReport()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminComponent;
