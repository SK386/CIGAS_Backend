const express = require("express");
const server = require("./server_var.js");
let veng = require("ejs");
const path = require("path")
const app = express();


// view engine config
app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");
app.set("views", "views");

// css and js
app.use(express.static(path.join('public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(favicon(__dirname + '/public/imagens/favicon.ico'));

// routes
//GET ROUTES
app.get("/", function(req, res){
        res.render("index.html", { title: "CIGAS - Home page" });
});

app.get("/dashboard", function(req, res){
        res.render("dashboard.html", { title:"Desktop" });
});

app.get("/login", function(req, res){
    res.render("login.html", { title:"CIGAS - Login" });
});
//POST ROUTES

app.listen(server.SERVER_PORT, function(){
    console.log(`Server running in localhost:${server.SERVER_PORT}`);
})
