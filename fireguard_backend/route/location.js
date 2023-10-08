const express = require('express');
const router = express.Router();
const {getLocation,addLocation,updateLocation,removeLocation} = require('../controller/locationController');

router.get('/', getLocation);
router.post('/', addLocation);
router.put('/:id', updateLocation);
router.delete('/:id', removeLocation);

module.exports = router;
