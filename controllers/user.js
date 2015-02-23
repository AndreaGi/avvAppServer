// Load required packages
var User = require('../models/user');
var moment = require("moment");
var jwt = require("jwt-simple");
var config = require('../config/config-dev');
var httpStatus = require('http-status-codes');

//Load the mailer
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email.address,
        pass: config.email.password
    }
});

// Create endpoint /api/users for POST
exports.postUser = function(req, res) {
    var query = User.where({email:req.body.email});
    query.findOne( function(err, existingUser) {
        if (err)
            res.json(httpStatus.INTERNAL_SERVER_ERROR,{error:err});

        if( !existingUser ){

            var user = new User({
                email: req.body.email,
                password: req.body.password,
                activationCode: generateActivationString()
            });

            user.save(function (err) {
                if (err)
                    res.end(err, httpStatus.INTERNAL_SERVER_ERROR);

                var emailToSend = getMailOptions(user.email, user.activationCode);
                transporter.sendMail(emailToSend, function (error, info) {
                    if (error)
                        console.log(error);
                    else
                        console.log('Message sent: ' + info.response);
                });

                res.sendStatus(httpStatus.CREATED);
            });

        }
    });
};

// Activate an user
exports.putUser = function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        if(err)
            res.send(err);

        if( user != null){
            if( user.activationCode === req.body.activationCode){
                User.update({email: req.body.email}, {
                    active: true
                }, function(err, num, raw) {
                        if (err) res.send(err);

                    res.sendStatus(httpStatus.OK);
                });
            }else
                res.end("Activation code not valid", httpStatus.UNAUTHORIZED);
        }else
            res.sendStatus(httpStatus.NOT_FOUND);
    });
};

exports.postUserToken = function(req, res){
    var query = User.where({email:req.body.email});
    query.findOne( function(err, existingUser) {
        if (err)
            res.json(httpStatus.INTERNAL_SERVER_ERROR,{error:err});

        if(existingUser.active && existingUser.password === req.body.password ){
            var expires = moment().add(7, 'days').valueOf();
            var token = jwt.encode({
                iss: existingUser.id,
                exp: expires
            }, config.secretToken);

            res.json({
                token: token,
                expires: expires,
                user: existingUser.toJSON()
            });
        }else
            res.end( "Wrong Password", httpStatus.EXPECTATION_FAILED);

    });
};

// Create endpoint /api/users/list for GET
exports.getUsers = function(req, res) {
    User.find(function(err, user) {
        if (err) res.end(err,httpStatus.INTERNAL_SERVER_ERROR);

        res.json(user);
    });
};

function generateActivationString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getMailOptions(userEmail, key)
{
    var mailOptions = {
        from: 'avvApp© <avvapp.noreply@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: 'Attiva il tuo account avvApp!', // Subject line
        text: 'Benvenuto su avvApp, attiva ora il tuo account usando la chiave segreta: ' + key, // plaintext body
        html: '<b>Benvenuto su avvApp,</b>' +
            '<br><p>La tua chiave segreta per attivare il tuo account è: ' + key + '</p>' +
            '<br>' +
            '<p>Saluti,</p>' +
            '<p>Il team di avvApp</p>' // html body
    };
    return mailOptions;
}