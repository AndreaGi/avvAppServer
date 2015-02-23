// @file jwauth.js

var User = require("../models/user");
var jwt = require("jwt-simple");
var config = require('../config/config-dev');
var httpStatus = require('http-status-codes');

module.exports = function(req, res, next){
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if(token) {
        try {
            var decoded = jwt.decode(token, config.secretToken);

            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', httpStatus.BAD_REQUEST);
            }

            res.userId = decoded.iss;
            return next();

        } catch (err) {
            return next();
        }
    }else{
        res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}