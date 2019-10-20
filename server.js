require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var path = require("path");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models/");

var PORT = process.env.PORT || 3000; 

var app = express();
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var MONGODB_URI =
process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Mongoose!");
});

var routes = require("./routes/routes.js");
routes(app);

app.listen(PORT, function() {
    console.log("Server listening on: http:localhost: " + PORT)
});