var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userController = require('./controllers/user');
var clientController = require('./controllers/client');
var categoryController = require('./controllers/category');
var documentController = require('./controllers/document');
var authController = require('./controllers/auth');

var configDB = require('./config/database.js');

// configuration
mongoose.connect(configDB.url); // connect to our database

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

var router = express.Router();

router.route("/users")
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers);

router.route("/clients")
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

router.route("/clients/:client_id")
    .get(authController.isAuthenticated, clientController.getClient)
    .put(authController.isAuthenticated, clientController.putClient)
    .delete(authController.isAuthenticated, clientController.deleteClient);

router.route("/categories")
    .post(authController.isAuthenticated, categoryController.postCategories)
    .get(authController.isAuthenticated, categoryController.getCategories);

router.route("/categories/:category_id")
    .get(authController.isAuthenticated, categoryController.getCategory)
    .put(authController.isAuthenticated, categoryController.putCategory)
    .delete(authController.isAuthenticated, categoryController.deleteCategory);

router.route("/documents")
    .post(authController.isAuthenticated, documentController.postDocuments)
    .get(authController.isAuthenticated, documentController.getDocuments);

router.route("/documents/:document_id")
    .get(authController.isAuthenticated, documentController.getDocument)
    .put(authController.isAuthenticated, documentController.putDocument)
    .delete(authController.isAuthenticated, documentController.deleteDocument);

app.use('/api', router);
var apiPort = 3000;


// Start the server
app.listen(apiPort);
console.log('The magic happens on port ' + apiPort);
