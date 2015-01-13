var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('../config/config-dev');
var User = require('../models/user');

describe('Routing', function() {
    var url = 'http://localhost:3000/api';

        //Test db connection
        before( function(done){
           mongoose.connect(config.db.mongodb);
            done();
        });

    describe("User", function(){

        it('should be able to create an user',function(done){
            var user = {
                email: "test@test.com",
                password: 'test'
            };

            request(url)
                .post('/users')
                .send(user)
                .expect({code:1}, done)
                .end(function(err, res){
                   if(err)
                        throw(err);
                });
        });
    });
});