var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");

var databaseUrl = "scraper";
var collections = ["scrapedData"]


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

                            // let article = {
                            //     title:title,
                            //     link: link,
                            //     saved: false
                            // }

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
        // res.send("Scrape Complete")
        res.redirect("/")
    })

    app.get("/articles/saved", function(req, res) {
        db.scrapedData.find({saved: true}).sort({'_id': -1})
        .then(function(err,article) {
            if (err) {
                console.error(err)
            }else {
                res.render("home", {article:article})
            }
        })
    })

    // app.get("/articles/saved", function(req,res) {
    //     db.scrapedData.find({})
    // })
    
}
 

