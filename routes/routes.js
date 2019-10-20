var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");
var mongoose = require("mongoose")
var databaseUrl = "scraper";
var collections = ["scrapedData"]

var db = require("../models")


var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
    res.sendStatus(500);
});

module.exports = function (app) {
    app.get("/", function (req, res) {
        db.scrapedData.find({}, function (err, found) {
            if (err) {
                console.log(err)
                res.sendStatus(500);
            } else {
                res.render('home', { found: found });
            }
        });
    });

    app.get("/saved", function(req,res) {
        db.scrapedData.find({saved:true}, function(err,found) {
        if (err) {
            console.log(err)
        }else {
            res.json(found)
        }
        })
    })

    //scraping into scraper
    app.get("/scrape", function (req, res) {

        axios.get("https://m.huffpost.com/").then(function (response) {
            var $ = cheerio.load(response.data)

            var results = [];

            $(".card__headline").each(function (i, element) {

                var title = $(element).children().text();
                var link = $(element).children().attr("href")



                db.scrapedData.find({}, function (err, found) {
                    if (err) {
                        console.log(err)
                        res.sendStatus(500);
                    }
                    if (found.length > 0) {
                        console.log("more than 0", found.length)

                    } else {
                        if (title && link) {

                            db.scrapedData.insert({
                                title: title,
                                link: link,
                                saved: false
                            },
                                function (err, inserted) {
                                    if (err) {
                                        console.log(err)
                                        res.sendStatus(500)
                                    } else {
                                        console.log(inserted)
                                    }
                                })
                        }
                    }
                });
            });
        })
        res.redirect("/")
    })

    app.put("/articles/save/:id", function (req, res) {
        db.scrapedData.update({ _id: req.params}, { $set: { saved: true } })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // app.put("/articles/save/:id", function(req,res) {
    //     console.log("PUT req....")
    //     console.log(req.body)
    //     console.log(req.params)
    // })

}


