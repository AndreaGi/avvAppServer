// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var clientSchema   = new mongoose.Schema({
    name        :String,
    vatNumber   :String,
    creationDate: {type:Date, default:Date.now},
    modificationDate: {type:Date, default:Date.now},
    userId      :String
}, { collection: 'client' });

// Export the Mongoose model
module.exports = mongoose.model('Client', clientSchema);