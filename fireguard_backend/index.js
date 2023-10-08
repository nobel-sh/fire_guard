const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const adminRouter = require('./route/admin');
const locationRouter = require('./route/location');
const incidentRouter = require('./route/incident');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/admin', adminRouter);
app.use('/api/location', locationRouter);
app.use('/api/incident', incidentRouter);

const start = async () => {
    try{
        await connectDB('mongodb+srv://pant:nahimmadomyownthing@fireguard.npxjm1f.mongodb.net/?retryWrites=true&w=majority');
        app.listen(8000, () => {
            console.log('Server started on port 8000');
        });
        
    }catch(e){
        console.log(e);
    }
}

start();
