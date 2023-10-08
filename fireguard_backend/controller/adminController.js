const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');
const Incident = require('../model/incident');
const Location = require('../model/location');

// Signup function
const adminSignup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            Admin.create({
                username: req.body.username,
                password: hash,
                email: req.body.email
            })
                .then(admin => {
                    res.status(201).json({
                        message: 'Admin created successfully',
                        result: admin
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: {
                            message: 'Invalid authentication credentials!'
                        }
                    });
                });
        });
};

// Login function
const adminLogin = (req, res, next) => {
    let fetchedAdmin;
    Admin.findOne({ email: req.body.email })
        .then(admin => {
            if (!admin) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            fetchedAdmin = admin;
            return bcrypt.compare(req.body.password, admin.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            // const token = jwt.sign(
            //     { email: fetchedAdmin.email, adminId: fetchedAdmin._id },
            //     'secret_this_should_be_longer',
            //     { expiresIn: '1h' }
            // );
            res.status(200).json({
                // token: token,
                // expiresIn: 3600,
                adminId: fetchedAdmin._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
};

const adminInform = async (req, res, next) => {
    const {id,confidence} = req.body;
    //TODO: notify admin
    const location = await Location.findById({_id: id});
    const incident_exists = await Incident.findOne({location: location._id});
    if (incident_exists) {
        return res.status(200).json({
            message: 'Incident already exists',
            result: incident_exists
        });
    }
    const incident = await Incident.create({
        location: location._id,
        status: 'unverified'
    });

    return res.status(200).json({
        message: 'Admin notified',
        result: incident
    });
}


module.exports = {
    adminSignup,
    adminLogin,
    adminInform
};
