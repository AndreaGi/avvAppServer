var express = require('express');
var userController = require('../controllers/user');
var clientController = require('../controllers/client');
var categoryController = require('../controllers/category');
var documentController = require('../controllers/documents');
var jwtAuth = require('../controllers/jwauth');

var router = express.Router();

router.route("/users")
    .put(userController.putUser)
    .post(userController.postUser);

router.route("/users/list")
    .get(jwtAuth, userController.getUsers);

router.route("/users/token")
    .post(userController.postUserToken);

router.route("/clients")
    .post(clientController.postClients)
    .get(clientController.getClients);

router.route("/clients/:client_id")
    .get(clientController.getClient)
    .put(clientController.putClient)
    .delete(clientController.deleteClient);

router.route("/categories")
    .post(categoryController.postCategories)
    .get(categoryController.getCategories);

router.route("/categories/:category_id")
    .get(categoryController.getCategory)
    .put(categoryController.putCategory)
    .delete(categoryController.deleteCategory);

router.route("/documents")
    .post(documentController.postDocuments)
    .get(documentController.getDocuments);

router.route("/documents/:document_id")
    .get(documentController.getDocument)
    .put(documentController.putDocument)
    .delete(documentController.deleteDocument);

module.exports = router;
