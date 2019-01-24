var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.render("login");
  });

  // Loads new user form page
  app.get("/createUser", function (req, res) {
    res.render("createUser");
  });


  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (dbExamples) {
      res.render("example", {
        example: dbExamples
      });
    });
  });

  app.get("/stocks/:symbol", function (req,res){
    console.log("f");
    var symbol = req.params.symbol;
    res.render("stockPage", {
      symbol : symbol
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
