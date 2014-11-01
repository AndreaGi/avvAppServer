// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var categorySchema   = new mongoose.Schema({
    name:    String,
    color:  String,
    order:  Number,
    userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Category', categorySchema);