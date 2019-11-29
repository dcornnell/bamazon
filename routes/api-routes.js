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

    //update a db with the incoming order

    app.put("/api/products", function(req, res) {
        for (let key in req.body) {
            console.log(key);
            console.log(req.body[key]);

            db.Product.update({ stock_quantity: req.body[key] }, { where: { id: key } }).then(function(results) {
                res.json(results);
            });
        }
    });
    //remove a product
    app.delete("/api/products/:id", function(req, res) {
        db.Product.destroy({ where: { id: req.params.id } }).then(function(result) {
            res.json(result);
        });
    });
};