// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var userSchema = new mongoose.Schema({
    email        : {type: String, set: toLower},
    password     : String,
    activationCode   : String,
    active       : {type: Boolean, default:false},
    showComplete: {type:Boolean, default:true}
}, { collection: 'user' });

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

function toLower(text){
    return text.toLowerCase();
}

// Export the Mongoose model
module.exports = mongoose.model('User', userSchema);