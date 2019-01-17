var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    //db.Example.findAll({}).then(function(dbExamples) {
    res.render("index");
    //msg: "Welcome to Stock X",
    // examples: dbExamples
    //});
    //});
  });

  // Loads new user form page
  app.get("/new-user", function(req, res) {
    res.render("createUser");
  });

  app.post("/new-user", function(req, res) {
    console.log(req.body);
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExamples) {
      res.render("example", {
        example: dbExamples
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
