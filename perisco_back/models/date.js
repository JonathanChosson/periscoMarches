const mongoose = require('mongoose'); 

const dateSchema = mongoose.Schema({
    dateResa: { type: String, required : true},
    enfantsInscrit: {type: Array, required:false},
},{timestamps: true});


module.exports = mongoose.model('Date', dateSchema);