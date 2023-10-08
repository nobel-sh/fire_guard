const Location = require('../model/location');
const Incident = require('../model/incident');

const getLocation = async (req, res) => {
    try {
        const [incidents, location] = await Promise.all([Incident.find().populate('location'), Location.find()]);
        if (incidents.length === 0) {
            return res.status(200).json(location);
        }
        if (location.length === 0) {
            return res.status(404).json({ error: 'Locations not found' });
        }
        const updatedLocations = location.map((loc) => {
            const incident = incidents.find((inc) => loc._id.toString() === inc.location._id.toString() && (inc.status === 'active' || inc.status === 'unverified'));
            if (incident) {
                console.log(incident);
                return { ...loc.toObject(), incident };
            }
            return loc.toObject();
        });
        res.status(200).json(updatedLocations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const addLocation = async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a location
const updateLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getLocation,
    updateLocation,
    removeLocation,
    addLocation
};