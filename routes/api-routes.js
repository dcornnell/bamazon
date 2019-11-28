const db = require("../models");
module.exports = function(app) {
    // find all products
    app.get("/api/products", function(req, res) {
        db.Product.findAll().then(function(results) {
            res.json(results);
        });
    });
    //find a single product
    app.get("/api/products/:id", function(req, res) {
        db.Product.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            res.json(result);
        });
    });
    //create product
    app.post("/api/products", function(req, res) {
        db.Product.create(req.body).then(function(results) {
            res.json(results);
        });
    });
    //update a product
    app.put("/api/products/:id", function(req, res) {
        db.Product.update({ stock_quantity: req.body.units }, { where: { id: req.params.id } }).then(function(result) {
            res.json(result);
        });
    });
    //remove a product
    app.delete("/api/products/:id", function(req, res) {
        db.Product.destroy({ where: { id: req.params.id } }).then(function(result) {
            res.json(result);
        });
    });
};