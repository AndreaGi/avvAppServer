// Load required packages
var User = require('../models/user');

//Load the mailer
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'avvapp.noreply@gmail.com',
        pass: ''
    }
});

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        activationCode: generateActivationString()
    });

    user.save(function(err) {
        if (err)
            res.send(err);

        var emailToSend = getMailOptions(user.email, user.activationCode);
        transporter.sendMail(emailToSend, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });

        res.json({ message: 'Ti è stata inviata una mail col codice di attivazione dell.account.' });

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