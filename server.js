// require packages
const express = require("express");

// Port and create the server
const PORT = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//require db
const db = require("./models");
// routes
require("./routes/api-routes.js")(app);
//sync the db
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("server is listening on " + PORT);
    });
});