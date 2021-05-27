const mongoose = require('mongoose'); 

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required : true, unique: true},
    password : {type: String, required : true},
    premiereConnexion: {type: Boolean, required: true},
    compteValid:{type: Boolean, required: true},
    nomDeFamille: {type: String, required:false},
    adresse : {type: String, required:false},
    tel1 : {type: String, required:false},
    tel2: {type: String, required:false},
    enfants: {type: Array, required:false},
    isAdmin: {type: Boolean, required:true}
},{timestamps: true});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);