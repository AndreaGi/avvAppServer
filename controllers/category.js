/**
 * Created by andreaghetti on 01/11/14.
 */
// Load required packages
var Category = require('../models/category');
var httpStatus = require('http-status-codes');

// Create endpoint /api/categories for POST
exports.postCategories= function(req, res) {
    // Create a new instance of the Category model
    var category = new Category();

    // Set the category properties that came from the POST data
    category.name = req.body.name;
    category.color = req.body.color;
    category.order = req.body.order;
    category.userId = res.userId;

    // Save the categories and check for errors
    category.save(function(err) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({result : category});
    });
};

// Create endpoint /api/categories for GET
exports.getCategories = function(req, res) {
    // Use the Category model to find all category
    Category.find({ userId: res.userId }, function(err, categories) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({result : categories});
    });
};

// Create endpoint /api/categories/:category_id for GET
exports.getCategory = function(req, res) {
    // Use the Category model to find a specific category
    Category.findOne({ _id: req.params.category_id }, function(err, category) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({result : category});
    });
};

// Create endpoint /api/categories/:category_id for PUT
exports.putCategory = function(req, res) {
    // Use the Category model to find a specific category
    Category.findByIdAndUpdate(req.params.category_id,{ $set: {
        name : req.body.name,
        color : req.body.color,
        order : req.body.order
    }}, function(err, category) {
        if (err) res.status(httpStatus.INTERNAL_SERVER_ERROR).end(err.message);

        res.status(httpStatus.OK).json({ result : category });
    });
};

// Create endpoint /api/categories/:category_id for DELETE
exports.deleteCategory = function(req, res) {
    // Use the Category model to find a specific category and remove it
    Category.remove({ _id: req.params.category_id }, function(err) {
        if (err) res.end(err, httpStatus.INTERNAL_SERVER_ERROR);
        res.status(httpStatus.OK).json({ message: 'Category removed' });
    });
};