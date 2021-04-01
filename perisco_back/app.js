const express = require('express');
const bobyParser = require('body-parser');
const mongoose = require('mongoose');

// const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const dateRoutes = require('./routes/date');

const app = express();

mongoose.connect('mongodb+srv://admin:pkoipa@cluster0.0fbz5.mongodb.net/cantine?retryWrites=true&w=majority', 
    { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true})
    .then(() =>console.log('Connexion à MongoDB réussi'))
    .catch(() =>console.log('Connexion à MongoDb échouée'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, userId');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bobyParser.json());

// app.use('/api/stuff', stuffRoutes);
app.use('/api/user', userRoutes);
app.use('/api/date', dateRoutes);


module.exports = app;