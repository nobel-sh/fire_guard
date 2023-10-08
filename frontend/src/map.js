import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, GeoJSON, Circle} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// URL of the GeoJSON file in the public directory
const nepalDistrictsDataUrl = '/data/nepal-districts.geojson';

function MapWithFireLocation() {
    const initialCenter = [28.6139, 84.2096];
    const [nepalDistrictsData, setNepalDistrictsData] = useState(null);
    const [locationList, setlocationList] = useState([]);

    const fetchData = () => {
        fetch(nepalDistrictsDataUrl)
            .then((response) => response.json())
            .then((data) => {
                setNepalDistrictsData(data);
            })
            .catch((error) => {
                console.log(error);
            });

        fetch('http://localhost:8000/api/location/')
            .then((response) => response.json())
            .then((data) => {
                setlocationList(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <button style={{position: "absolute", zIndex: 99999, bottom: 8, right: 8, padding: 8}} onClick={fetchData}>Refresh</button>
            <MapContainer
                center={initialCenter}
                zoom={6}
                style={{height: '1000px', width: '100%'}}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locationList.map((location, index) => {
                    let markerIcon = new L.Icon({
                        iconUrl: 'https://i.ibb.co/ysVvrW7/3209141.png', // normal emoji icon
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                    })
                    if (location.incident) {
                        markerIcon = new L.Icon({
                            iconUrl: 'https://i.ibb.co/m5qbNT8/fire-201x256.png', // Fire emoji icon
                            iconSize: [32, 32],
                            iconAnchor: [16, 32],
                        })
                    }

                    return (
                        <Marker key={index} position={[location.latitude, location.longitude]} icon={markerIcon}>
                            <Popup>
                                {location.incident ? `Fire detected at ${location.name}!` : `Scanning at ${location.name}!`}
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Add a gradient circle around each fire location */}
                {locationList.map((location, index) => {
                    if (location !== null) {
                        return (
                            <Circle
                                key={index}
                                center={[location.latitude, location.longitude]}
                                radius={3000} // Adjust the radius (in meters) as needed
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
                    <GeoJSON data={nepalDistrictsData} style={{color: '#0661c2', weight: 1}} />
                )}
            </MapContainer>
        </>
    );
}

export default MapWithFireLocation;
