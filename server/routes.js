const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");

function route(app, express, db) {
    //Use helmet to secure the API
    app.use(helmet());
    app.use(morgan('tiny'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //Create the base route
    const todoRoutes = require("./modules/todo/routes")(express, db);
    app.use("/api", todoRoutes);
}

module.exports = route;