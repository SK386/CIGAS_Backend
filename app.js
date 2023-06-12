const express = require("express");
const server = require("./server/server_var.js");
const app = express();
const port = SERVER_PORT;

app.listen(port, function(){
    console.log(`Server running in localhost:${port}`);
})
