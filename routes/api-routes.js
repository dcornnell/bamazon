const db = require("../models");
const Op = db.Sequelize.Op;
module.exports = function(app) {
    // find all products
    app.get("/api/products", function(req, res) {
        db.Product.findAll().then(function(results) {
            res.json(results);
        });
    });

    // find products with low inventory
    app.get("/api/products/low", function(req, res) {
        db.Product.findAll({
            where: {
                stock_quantity: {
                    [Op.lte]: 5
                }
            }
        }).then(function(results) {
            res.json(results);
        });
    });
    //find a single product [not currently used in program]
    app.get("/api/products/:id", function(req, res) {
        db.Product.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            res.json(result);
        });
    });
    //creates a product
    app.post("/api/products", function(req, res) {
        db.Product.create(req.body).then(function(results) {
            res.json(results);
        });
    });
    //updates a product
    app.put("/api/products/:id", function(req, res) {
        console.log(req.body.units);
        console.log(req.params);
        db.Product.increment({ stock_quantity: req.body.units }, { where: { id: req.params.id } }).then(function(result) {
            res.json(result);
        });
    });

    //update the db with the incoming order

    app.put("/api/products", function(req, res) {
        for (let key in req.body) {
            db.Product.decrement({ stock_quantity: req.body[key] }, { where: { id: key } });
        }
        res.end();
    });
    //remove a product [ not currently implemented]
    app.delete("/api/products/:id", function(req, res) {
        db.Product.destroy({ where: { id: req.params.id } }).then(function(result) {
            res.json(result);
        });
    });
};