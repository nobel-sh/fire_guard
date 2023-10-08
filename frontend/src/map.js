import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ClearIcon from '@mui/icons-material/Clear';

// URL of the GeoJSON file in the public directory
const nepalDistrictsDataUrl = '/data/nepal-districts.geojson';

function MapWithFireLocation() {
    const initialCenter = [28.6139, 84.2096];
    const [nepalDistrictsData, setNepalDistrictsData] = useState(null);
    const [locationList, setlocationList] = useState([]);
    const [viewAllLocations, setViewAllLocations] = useState(true);

    const fetchData = () => {
        fetch(nepalDistrictsDataUrl)
            .then((response) => response.json())
            .then((data) => {
                setNepalDistrictsData(data);
            })
            .catch((error) => {
                console.log(error);
            });

        if (viewAllLocations) {
            fetch('http://localhost:8000/api/location/')
                .then((response) => response.json())
                .then((data) => {
                    setlocationList(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // Set an empty location list to show no locations
            setlocationList([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [viewAllLocations]);

    const handleChange = (_, newValue) => {
        if (newValue === 'all') {
            setViewAllLocations(true);
        } else if (newValue === 'none') {
            setViewAllLocations(false);
        }
    };

    return (
        <>
          <div style={{ position: "absolute", zIndex: 99999, top: '80%', right: '10px', backgroundColor: 'white', border: '2px solid #6499E9', borderRadius: '10px', padding: '5px' }}>
    <ToggleButtonGroup
        orientation="vertical"
        value={viewAllLocations ? 'all' : 'none'}
        exclusive
        onChange={handleChange}
    >
        <ToggleButton
            value="all"
            aria-label="Show All Locations"
            style={{
                backgroundColor: 'white',
                marginBottom: '10px',
                border: '2px solid #6499E9',
                borderRadius: '10px',
            }}
            classes={{
                root: 'toggle-button-root',
                selected: 'toggle-button-selected',
            }}
        >
            <img src="https://cdn-icons-png.flaticon.com/512/785/785116.png" alt="Your Logo" style={{ width: '30px', height: '30px' }} />
        </ToggleButton>
        <ToggleButton
            value="none"
            aria-label="Highlight No Locations"
            style={{
                backgroundColor: 'white',
                border: '2px solid #6499E9',
                borderRadius: '10px',
            }}
            classes={{
                root: 'toggle-button-root',
                selected: 'toggle-button-selected',
            }}
        >
            <img src="https://i.ibb.co/PzkcPLJ/66163-removebg-preview.png" alt="Your Logo" style={{ width: '30px', height: '30px' }} />
        </ToggleButton>
    </ToggleButtonGroup>
</div>



            <MapContainer
                center={initialCenter}
                zoom={6}
                style={{ height: '1000px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locationList.map((location, index) => {
                    if (viewAllLocations) {
                        let markerIcon = new L.Icon({
                            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2062/2062582.png', // normal emoji icon
                            iconSize: [25, 25],
                            iconAnchor: [16, 32],
                        });

                        if (location.incident) {
                            markerIcon = new L.Icon({
                                iconUrl: 'https://cdn-icons-png.flaticon.com/512/785/785116.png', // Fire emoji icon
                                iconSize: [25, 25],
                                iconAnchor: [16, 32],
                            });
                        }

                        return (
                            <Marker key={index} position={[location.latitude, location.longitude]} icon={markerIcon}>
                                <Popup>
                                    {location.incident ? `Fire detected at ${location.name}!` : `Scanning at ${location.name}!`}
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}

                {/* Add a gradient circle around each fire location */}
                {locationList.map((location, index) => {
                    if (viewAllLocations) {
                        return (
                            <Circle
                                key={index}
                                center={[location.latitude, location.longitude]}
                                radius={4000} // Adjust the radius (in meters) as needed
                                pathOptions={{
                                    fill: true,
                                    fillColor: 'rgba(255, 0, 0, 0.7)', // Adjust the gradient color and opacity
                                    gradient: true, // Enable gradient fill
                                    color: 'transparent',
                                }}
                            />
                        );
                    }
                    return null;
                })}

                {nepalDistrictsData && (
                    <GeoJSON data={nepalDistrictsData} style={{ color: '#0661c2', weight: 1 }} />
                )}
            </MapContainer>
        </>
    );
}

export default MapWithFireLocation;
