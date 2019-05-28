const mongoose = require("mongoose");
const config = require("./config");


let dbObj;

function Database(mongoose, config) {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.db}`, { useNewUrlParser: true });

    this.getInstance = () => mongoose;
    this.getSchema = () => mongoose.Schema;
    this.getModel = () => mongoose.model;
};


module.exports = new Database(mongoose, config);