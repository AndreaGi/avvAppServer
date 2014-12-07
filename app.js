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
var documentController = require('./controllers/documents');
var jwtAuth = require('./controllers/jwauth');

var configDB = require('./config/database.js');

// configuration
mongoose.connect(configDB.url); // connect to the database

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('jwtTokenSecret', 'avvAppSecretToken');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

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

app.use('/api', router);
var apiPort = 3000;


// Start the server
app.listen(apiPort);
console.log('The magic happens on port ' + apiPort);
