const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");

function route(app, express, db) {
    //Use helmet to secure the API
    app.use(helmet());
    app.use(morgan('tiny'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
    });

    //Create the base route
    const todoRoutes = require("./modules/todo/routes")(express, db);
    app.use("/api/todos", todoRoutes);
}

module.exports = route;