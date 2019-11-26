module.exports = function(sequelize, dataTypes) {
    const Product = sequelize.define("Product", {
        product_name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        department_name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        price: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        stock_quantity: {
            type: dataTypes.INTEGER,
            allowNull: false
        }

    })

    return Product;
};