// Load required packages
var Client = require('../models/client');

// Create endpoint /api/clients for POST
exports.postClients = function(req, res) {
    // Create a new instance of the Client model
    var client = new Client();

    // Set the client properties that came from the POST data
    client.name = req.body.name;
    client.vatNumber = req.body.vatNumber;
    client.userId = req.user._id;

    // Save the clients and check for errors
    client.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Client saved!', data: client });
    });
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
    // Use the Client model to find all client
    Client.find({ userId: req.user._id }, function(err, clients) {
        if (err)
            res.send(err);

        res.json(clients);
    });
};

// Create endpoint /api/clients/:client_id for GET
exports.getClient = function(req, res) {
    // Use the Client model to find a specific client
    Client.find({ userId: req.user._id, _id: req.params.client_id }, function(err, client) {
        if (err)
            res.send(err);

        res.json(client);
    });
};

// Create endpoint /api/clients/:client_id for PUT
exports.putClient = function(req, res) {
    // Use the Client model to find a specific client
    Client.update({ userId: req.user._id, _id: req.params.client_id }, {
        name : req.body.name,
        vatNumber : req.body.vatNumber
    }, function(err, num, raw) {
        if (err)
            res.send(err);

        res.json({ message: num + ' updated' });
    });
};

// Create endpoint /api/clients/:client_id for DELETE
exports.deleteClient = function(req, res) {
    // Use the Client model to find a specific client and remove it
    Client.remove({ userId: req.user._id, _id: req.params.client_id }, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Client removed' });
    });
};