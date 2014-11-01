/**
 * Created by andreaghetti on 01/11/14.
 */
// Load required packages
var Category = require('../models/category');

// Create endpoint /api/categories for POST
exports.postCategories= function(req, res) {
    // Create a new instance of the Category model
    var category = new Category();

    // Set the category properties that came from the POST data
    category.name = req.body.name;
    category.color = req.body.color;
    category.order = req.body.order;
    category.userId = req.user._id;

    // Save the categorys and check for errors
    category.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Category saved!', data: category });
    });
};

// Create endpoint /api/categories for GET
exports.getCategories = function(req, res) {
    // Use the Category model to find all category
    Category.find({ userId: req.user._id }, function(err, categorys) {
        if (err)
            res.send(err);

        res.json(categorys);
    });
};

// Create endpoint /api/categorys/:category_id for GET
exports.getCategory = function(req, res) {
    // Use the Category model to find a specific category
    Category.find({ userId: req.user._id, _id: req.params.category_id }, function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
};

// Create endpoint /api/categorys/:category_id for PUT
exports.putCategory = function(req, res) {
    // Use the Category model to find a specific category
    Category.update({ userId: req.user._id, _id: req.params.category_id }, {
        name : req.body.name,
        color : req.body.color,
        order : req.body.order
    }, function(err, num, raw) {
        if (err)
            res.send(err);

        res.json({ message: num + ' updated' });
    });
};

// Create endpoint /api/categorys/:category_id for DELETE
exports.deleteCategory = function(req, res) {
    // Use the Category model to find a specific category and remove it
    Category.remove({ userId: req.user._id, _id: req.params.category_id }, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Category removed' });
    });
};