const express = require('express');
const router = express.Router();
const incidentController = require('../controller/incidentController');

// GET all incidents
router.get('/', incidentController.getAllIncidents);

// GET a specific incident by ID
router.get('/:id', incidentController.getIncidentById);

// POST a new incident
router.post('/', incidentController.createIncident);

// PUT (update) an existing incident by ID
router.put('/:id', incidentController.updateIncidentById);

// DELETE an existing incident by ID
router.delete('/:id', incidentController.deleteIncidentById);

// Verify an incident by ID
router.put('/verify/:id', incidentController.verifyIncident);

module.exports = router;
