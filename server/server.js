const express = require("express");
const server = require("./server_var.js");
const app = express();

app.listen(server.SERVER_PORT, function(){
    console.log(`Server running in localhost:${server.SERVER_PORT}`);
})
