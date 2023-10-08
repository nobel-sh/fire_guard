const Incident = require('../model/incident');
const Location = require('../model/location');

// Create a new incident
const createIncident = async (req, res) => {
    try {
        const incident = await Incident.create(req.body);
        const location = await Location.updateOne({ _id: incident.location }, { status: 'active' });
        const response = await Incident.findById(incident._id).populate('location');
        res.status(201).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all incidents
const getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate('location');
        res.status(200).json(incidents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single incident by ID
const getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id).populate('location');
        if (!incident) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        res.status(200).json(incident);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an incident by ID
const updateIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!incident) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        res.status(200).json(incident);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an incident by ID
const deleteIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findByIdAndDelete(req.params.id).populate('location');
        if (!incident) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        res.status(200).json({ message: 'Incident deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id).populate('location');
        if (!incident) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        // TODO: send sms to necessary people
        const updatedIncident = await Incident.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
        res.status(200).json(updatedIncident);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentById,
    deleteIncidentById,
    verifyIncident,
};
