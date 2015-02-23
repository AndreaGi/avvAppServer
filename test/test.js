var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('../config/config-dev');
var User = require('../models/user');
var httpStatus = require('http-status-codes');

var url = 'http://localhost:3000/api';
var emailToTest = "test@test.com";
var passwordToTest = "test";

//Test db connection
before( function(done){
    mongoose.connect(config.db.mongodb);
    done();
});

describe('Not secure Routing', function() {

    describe("User", function(){


        it('should be able to create an user',function(done){
            var user = {
                email: emailToTest,
                password: passwordToTest
            };

            request(url)
                .post('/users')
                .send(user)
                .expect(httpStatus.CREATED)
                .end(function(err, res){
                   if(err) return done(err);
                    done();
                });
        });


        it('should be able to modify/activate the user', function(done){

            var activationCode = null;

                // Get activation code
            mongoose.model("User").findOne({ email : emailToTest}, function(err, user) {
                if (err) return err;
                activationCode = user.activationCode;



                var data = { "email" : emailToTest, "activationCode" : activationCode};

                request(url)
                    .put("/users")
                    .send(data)
                    .expect(httpStatus.OK)
                    .end(function(err){
                        if(err) return done(err);
                        done();
                    });
            });

        });

    });

});

    describe("Secure Routing", function(){

        var token  = null;

        before( function(done){
            request(url)
                .post('/users/token')
                .send({ email: emailToTest , password: passwordToTest })
                .end(function(err, res) {
                    token = res.body.token;
                    done();
                });
        });

        describe("User", function() {

            it('Should get a valid token for the test user', function (done) {

                request(url)
                    .get("/users/list")
                    .set("x-access-token", token)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });

            });
        });

        describe("Client", function(){

            var clientId = null;

            var client = {
                name : "Client Test",
                vatNumber  : 0007
            };
            var newName = "Client new name";

            it('Should be able to save a new client', function(done){

                request(url)
                    .post("/clients")
                    .set("x-access-token", token)
                    .send(client)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        clientId = res.body.result._id;
                        done();
                    });

            });

            it('Should be able to update a client', function(done){

                client.name = newName;

                request(url)
                    .put("/clients/" + clientId)
                    .set("x-access-token", token)
                    .send(client)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });

            });

            it('Should be able to retrieve a client by Id', function(done){

                request(url)
                    .get("/clients/" + clientId)
                    .set("x-access-token", token)
                    .send(client)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.result.name, newName);
                        done();
                    });

            });

            it('Should be able to retrieve a list of clients', function(done){

                request(url)
                    .get("/clients")
                    .set("x-access-token", token)
                    .send(client)
                    .expect(httpStatus.OK)
                    .end(function (err) {
                        if (err) return done(err);
                        done();
                    });

            });

            it('Should be able to remove a client', function(done){

                request(url)
                    .del("/clients/" + clientId)
                    .set("x-access-token", token)
                    .send(client)
                    .expect(httpStatus.OK)
                    .end(function (err) {
                        if (err) return done(err);
                        done();
                    });

            });

        });

        describe("Category", function(){

            var categoryId = null;

            var category = {
                name: "test category",
                color: "#ffffff",
                order: 1
            };

            var categoryNewName = "categoryNewName";

            it('Should be able to save a new category', function(done){

                request(url)
                    .post("/categories")
                    .set("x-access-token", token)
                    .send(category)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        categoryId = res.body.result._id;
                        done();
                    });

            });

            it('Should be able to update a category', function(done){

                category.name = categoryNewName;

                request(url)
                    .put("/categories/" + categoryId)
                    .set("x-access-token", token)
                    .send(category)
                    .expect(httpStatus.OK)
                    .end(function (err) {
                        if (err) return done(err);
                        done();
                    });

            });

            it('Should be able to retrieve a category by Id', function(done){

                request(url)
                    .get("/categories/" + categoryId)
                    .set("x-access-token", token)
                    .send(category)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        assert.equal(res.body.result.name, categoryNewName);
                        done();
                    });

            });

            it('Should be able to retrieve a list of categories', function(done){

                request(url)
                    .get("/categories")
                    .set("x-access-token", token)
                    .expect(httpStatus.OK)
                    .end(function (err) {
                        if (err) return done(err);
                        done();
                    });

            });

            it('Should be able to remove a category', function(done){

                request(url)
                    .del("/categories/" + categoryId)
                    .set("x-access-token", token)
                    .send(category)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });

            });

        });

        //describe("Document", function(){
        //
        //    var documentId = null;
        //
        //    var document = {
        //        name: "test category",
        //        color: "#ffffff",
        //        order: 1
        //    };
        //
        //    var categoryNewName = "categoryNewName";
        //
        //    it('Should be able to save a new category', function(done){
        //
        //        request(url)
        //            .post("/categories")
        //            .set("x-access-token", token)
        //            .send(category)
        //            .expect(httpStatus.OK)
        //            .end(function (err, res) {
        //                if (err) return done(err);
        //                categoryId = res.body.result._id;
        //                done();
        //            });
        //
        //    });
        //
        //    it('Should be able to update a category', function(done){
        //
        //        category.name = categoryNewName;
        //
        //        request(url)
        //            .put("/categories/" + categoryId)
        //            .set("x-access-token", token)
        //            .send(category)
        //            .expect(httpStatus.OK)
        //            .end(function (err) {
        //                if (err) return done(err);
        //                done();
        //            });
        //
        //    });
        //
        //    it('Should be able to retrieve a category by Id', function(done){
        //
        //        request(url)
        //            .get("/categories/" + categoryId)
        //            .set("x-access-token", token)
        //            .send(category)
        //            .expect(httpStatus.OK)
        //            .end(function (err, res) {
        //                if (err) return done(err);
        //                assert.equal(res.body.result.name, categoryNewName);
        //                done();
        //            });
        //
        //    });
        //
        //    it('Should be able to retrieve a list of categories', function(done){
        //
        //        request(url)
        //            .get("/categories")
        //            .set("x-access-token", token)
        //            .expect(httpStatus.OK)
        //            .end(function (err) {
        //                if (err) return done(err);
        //                done();
        //            });
        //
        //    });
        //
        //    it('Should be able to remove a category', function(done){
        //
        //        request(url)
        //            .del("/categories/" + categoryId)
        //            .set("x-access-token", token)
        //            .send(category)
        //            .expect(httpStatus.OK)
        //            .end(function (err, res) {
        //                if (err) return done(err);
        //                done();
        //            });
        //
        //    });
        //
        //});

    });

    after(function(done){
        //Remove the created user
        mongoose.model("User").remove({ email: emailToTest }, function (err) {
            if (err) return(err);
        });
        done();
    });

