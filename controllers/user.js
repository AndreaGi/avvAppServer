// Load required packages
var User = require('../models/user');
var moment = require("moment");
var jwt = require("jwt-simple");
var config = require('../config/config-dev');

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
    var existingUser;
    var query = User.where({email:req.body.email});
    query.findOne( function(err, existingUser) {
        if (err)
            res.json({ code: 2 });

        if( existingUser ) {

            if(existingUser.active) {
                var expires = moment().add('days', 7).valueOf();
                var token = jwt.encode({
                    iss: user.id,
                    exp: expires
                }, app.get('jwtTokenSecret'));

                res.json({
                    code: 0,
                    token: token,
                    expires: expires,
                    user: existingUser.toJSON()
                });
            }else{
                res.json({ code: 2 });
            }

        }else {

            var user = new User({
                email: req.body.email,
                password: req.body.password,
                activationCode: generateActivationString()
            });

            user.save(function (err) {
                if (err)
                    res.send(err);

                var emailToSend = getMailOptions(user.email, user.activationCode);
                transporter.sendMail(emailToSend, function (error, info) {
                    if (error)
                        console.log(error);
                    else
                        console.log('Message sent: ' + info.response);
                });

                res.json({ code: 1 });

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
                user.active = false;
                User.update({email: req.body.email}, {
                    activate: true
                }, function(err, num, raw) {
                        if (err)
                            res.send(err);

                    res.json({code:2});
                });
            }else{
                res.json({code:1});
            }
        }else
            res.json({code:0});
    });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
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