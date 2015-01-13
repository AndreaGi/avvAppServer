var express = require('express');
var bodyParser = require('body-parser');
var jwtAuth = require('../controllers/jwauth');
var userController = require('../controllers/user');
var clientController = require('../controllers/client');
var categoryController = require('../controllers/category');
var documentController = require('../controllers/documents');

var router = express.Router();

router.route("/users")
    .put(userController.putUser)
    .post(userController.postUser)
    .get([bodyParser.json(), jwtAuth], userController.getUsers);

router.route("/clients")
    .post([bodyParser.json(), jwtAuth], clientController.postClients)
    .get([bodyParser.json(), jwtAuth], clientController.getClients);

router.route("/clients/:client_id")
    .get([bodyParser.json(), jwtAuth], clientController.getClient)
    .put([bodyParser.json(), jwtAuth], clientController.putClient)
    .delete([bodyParser.json(), jwtAuth], clientController.deleteClient);

router.route("/categories")
    .post([bodyParser.json(), jwtAuth], categoryController.postCategories)
    .get([bodyParser.json(), jwtAuth], categoryController.getCategories);

router.route("/categories/:category_id")
    .get([bodyParser.json(), jwtAuth], categoryController.getCategory)
    .put([bodyParser.json(), jwtAuth], categoryController.putCategory)
    .delete([bodyParser.json(), jwtAuth], categoryController.deleteCategory);

router.route("/documents")
    .post([bodyParser.json(), jwtAuth], documentController.postDocuments)
    .get([bodyParser.json(), jwtAuth], documentController.getDocuments);

router.route("/documents/:document_id")
    .get([bodyParser.json(), jwtAuth], documentController.getDocument)
    .put([bodyParser.json(), jwtAuth], documentController.putDocument)
    .delete([bodyParser.json(), jwtAuth], documentController.deleteDocument);

module.exports = router;
