// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var documentSchema   = new mongoose.Schema({
    categoryId  :String,
    clientId    :String,
    isComplete  :{type:Boolean, default:false},
    title       :String,
    body        :String,
    creationDate: {type:Date, default:Date.now},
    modificationDate: {type:Date, default:Date.now},
    userId      :String
}, { collection: 'document' });

// Export the Mongoose model
module.exports = mongoose.model('Document', documentSchema);