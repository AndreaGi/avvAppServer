// Load required packages
var Document = require('../models/document');

// Create endpoint /api/documents for POST
exports.postDocuments = function(req, res) {
    // Create a new instance of the Document model
    var document = new Document();

    // Set the document properties that came from the POST data
    document.categoryId = req.body.categoryId;
    document.clientId = req.body.clientId;
    document.isComplete = req.body.isComplete;
    document.title = req.body.title;
    document.body = req.body.body;
    document.userId = req.user._id;

    // Save the documents and check for errors
    document.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Document saved!', data: document });
    });
};

// Create endpoint /api/documents for GET
exports.getDocuments = function(req, res) {
    // Use the Document model to find all document
    Document.find({ userId: req.user._id }, function(err, documents) {
        if (err)
            res.send(err);

        res.json(documents);
    });
};

// Create endpoint /api/documents/:document_id for wbr
exports.getDocument = function(req, res) {
    // Use the Document model to find a specific document
    Document.find({ userId: req.user._id, _id: req.params.document_id }, function(err, document) {
        if (err)
            res.send(err);

        res.json(document);
    });
};

// Create endpoint /api/documents/:document_id for PUT
exports.putDocument = function(req, res) {
    // Use the Document model to find a specific document
    Document.update({ userId: req.user._id, _id: req.params.document_id }, {
        categoryId : req.body.categoryId,
        clientId : req.body.clientId,
        isComplete : req.body.isComplete,
        title : req.body.title,
        body : req.body.body
    }, function(err, num, raw) {
        if (err)
            res.send(err);

        res.json({ message: num + ' updated' });
    });
};

// Create endpoint /api/documents/:document_id for DELETE
exports.deleteDocument = function(req, res) {
    // Use the Document model to find a specific document and remove it
    Document.remove({ userId: req.user._id, _id: req.params.document_id }, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Document removed' });
    });
};