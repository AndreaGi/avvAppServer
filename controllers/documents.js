// Load required packages
var Document = require('../models/document');
var httpStatus = require('http-status-codes');

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
    document.userId = res.userId;

    // Save the documents and check for errors
    document.save(function(err) {
        if (err)res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({result : document});
    });
};

// Create endpoint /api/documents for GET
exports.getDocuments = function(req, res) {
    // Use the Document model to find all document
    Document.find({ userId: res.userId }, function(err, documents) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({result : documents});
    });
};

// Create endpoint /api/documents/:document_id for wbr
exports.getDocument = function(req, res) {
    // Use the Document model to find a specific document
    Document.findOne({_id: req.params.document_id }, function(err, document) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({result : document});
    });
};

// Create endpoint /api/documents/:document_id for PUT
exports.putDocument = function(req, res) {
    // Use the Document model to find a specific document
    Document.findByIdAndUpdate({ _id: req.params.document_id }, {
        categoryId : req.body.categoryId,
        clientId : req.body.clientId,
        isComplete : req.body.isComplete,
        title : req.body.title,
        body : req.body.body
    }, function(err, document) {
        if (err) res.status(httpStatus.INTERNAL_SERVER_ERROR).end(err.message);
        res.status(httpStatus.OK).json({ result : document });
    });
};

// Create endpoint /api/documents/:document_id for DELETE
exports.deleteDocument = function(req, res) {
    // Use the Document model to find a specific document and remove it
    Document.remove({ _id: req.params.document_id }, function(err) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({ message: 'Document removed' });
    });
};