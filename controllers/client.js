// Load required packages
var Client = require('../models/client');
var httpStatus = require('http-status-codes');

// Create endpoint /api/clients for POST
exports.postClients = function(req, res) {
    // Create a new instance of the Client model
    var client = new Client();

    // Set the client properties that came from the POST data
    client.name = req.body.name;
    client.vatNumber = req.body.vatNumber;
    client.userId = res.userId;

    // Save the clients and check for errors
    client.save(function(err) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);

        res.status(httpStatus.OK).json({result : client});
    });
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
    // Use the Client model to find all client
    Client.find({ userId: res.userId }, function(err, clients) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);

        res.status(httpStatus.OK).json({result : clients});
    });
};

// Create endpoint /api/clients/:client_id for GET
exports.getClient = function(req, res) {
    // Use the Client model to find a specific client
    Client.findOne({ userId: res.userId, _id: req.params.client_id }, function(err, client) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);

        res.status(httpStatus.OK).json({result : client});
    });
};

// Create endpoint /api/clients/:client_id for PUT
exports.putClient = function(req, res) {
    // Use the Client model to find a specific client
    Client.findByIdAndUpdate(req.params.client_id,{ $set: {
        name : req.body.name,
        vatNumber : req.body.vatNumber
    }}, function(err, client) {
        if (err) res.status(httpStatus.INTERNAL_SERVER_ERROR).end(err.message);

        res.status(httpStatus.OK).json({ result : client });
    });
};

// Create endpoint /api/clients/:client_id for DELETE
exports.deleteClient = function(req, res) {
    // Use the Client model to find a specific client and remove it
    Client.remove({ userId: res.userId, _id: req.params.client_id }, function(err) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);

        res.status(httpStatus.OK).json({ message: 'Client removed' });
    });
};