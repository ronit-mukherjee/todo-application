const express = require("express");

const db = require("./database");


const port = process.env.NODE_PORT || 3000;
const server = express();

require("./routes")(server, express, db);

if (db) { // DB connected now make server available to use
    server.listen(port, () => {
        console.log("Server listening at " + port);
    });
} else {
    console.log("DB can't be connected, Check your settings");
}
