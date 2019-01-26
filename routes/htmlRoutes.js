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

  app.get("/stocks/:symbol/:user_id", function (req,res){
    var symbol = req.params.symbol;
    var user_id = req.params.user_id;
    console.log(req.params);
    db.Users.findOne({where: {user_id: user_id}}).then(function(user){
      if(user){
        db.Positions.findOne({where:{user_id: user_id, symbol: symbol}}).then(function(position){
          var quantity = 0;
          if(position){
            quantity = position.quantity;
          }
          
          res.render("stockPage", {
            symbol : symbol,
            budget : user.budget,
            quantity : quantity
          });        
        })
      }
    })
    
  });
  
  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
