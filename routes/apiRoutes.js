var db = require("../models");
var Users = db.Users;
var Positions = db.Positions;

module.exports = function (app) {
  // Get all users for user selection in frontend
  app.get("/api/users", function (req, res) {
    db.Users.findAll({}).then(function (records) {
      res.json(records);
    });
  });

  app.post("/api/users", function (req, res) {
    var user = req.body;
    db.Users.create(
      {
        user_id: user.user_id, name: user.name, budget: user.budget
      }).then(function (record) {
        console.log("user id:" + record.user_id + " name: " + record.name + " budget: " + record.budget);
        res.status(200).end();
      }).catch(function (err) {
        res.status(500).end();
      });
  });

  // get all positions for fun!
  app.get("/api/positions", function (req, res) {
    db.Positions.findAll({ include: [Users] }).then(function (records) {
      res.json(records);
    });
  });

  app.get("/api/user/get", function (req, res) {
    if (userId === "") throw "EMPTY USER";
    db.Users.findOne({ where: { user_id: userId } }).then(function (user) {
      res.json(user);
    });

  });

  //get position for speicific user_id
  var userId = "";

  app.post("/loginUser", function (req, res) {
    if (req.body.userId === "") throw "USER ID CANNOT BE SET TO EMPTY THROUGH THIS METHOD";
    userId = req.body.userId;
    res.json({ success: true });
  });


  app.post("/logoutUser", function (req, res) {
    userId = "";
    res.json({ success: true });
  });


  app.get("/index", function (req, res) {

    if (userId === "") throw "USER ID IS EMPTY";

    new Promise(getUserData).then(function (user) {

      res.render("index", user);
    });

  });

  app.get("/data", function (req, res) {

    new Promise(getUserData).then(function (user) {
      res.json(user);
    });
  });

  function getUserData(resolve, reject) {
    db.Users.findOne({ where: { user_id: userId } }).then(function (user) {
      db.Positions.findAll({ where: { user_id: userId }, include: [Users] }).then(function (records) {
        resolve({
          user: user,
          user_id: user.get("user_id"),
          name: user.get("name"),
          budget: user.get("budget"),
          positions: records
        });
      });
    });
  }


  function enterNewPosition(resolve, user, quantity, symbol) {
    if (quantity < 1) {
      throw "ILLEGAL TRANSACTION";
    }
    Positions.create({
      user_id: user.user_id,
      symbol: symbol,
      quantity: quantity
    }).then(function (position) {
      resolve(position);
    });
  }

  function changePosition(res, user, price, position, quantity, buying, symbol) {
    var i = -1;
    if (buying) i = 1;
    var budget = user.budget;
    var newBudget = budget - i * price;
    var newQuantity = -1;

    if (position === undefined) {
      newQuantity = i * quantity;
    } else {
      newQuantity = position.quantity + i * quantity;
    }

    console.log(newQuantity + " " + newBudget);

    if (newBudget < 0) {
      console.log("not enough money");
      res(position);
    } else if (newQuantity < 0) {
      console.log("not enough shares");
      res(position);
    } else {

      new Promise(function (resolve, reject) {
        if (position === undefined) {
          enterNewPosition(resolve, user, newQuantity, symbol);
        } else {
          resolve(position);
        }
      }).then(function (newPosition) {
        updatePositions(newPosition, user, newQuantity, newBudget);
        res(newPosition);

      });

    }
  }

  async function updatePositions(position, user, newQuantity, newBudget) {

    
    user.budget = newBudget;
    position.quantity = newQuantity;
    position.save().then(user.save().then(function () {
      console.log("new position is " + newQuantity + " shares of " + position.symbol);
      console.log("balance is " + newBudget);
      if (newQuantity === 0) {
        Positions.destroy({
          where: {
            user_id: position.user_id,
            symbol: position.symbol
          }
        });
      }
    }));
  }


  app.post("/api/purchase/", function (req, res) {

    var body = req.body;
    var symbol = body.symbol;
    var price = body.price;
    var buying = body.buying == 'true';
    new Promise(getUserData).then(function (data) {

      var position = data.positions.find(function (element) {
        return element.symbol === symbol;
      });

      new Promise(function (resolve, reject) {
        changePosition(resolve, data.user, price, position, 1, buying, symbol)

      }).then(function (position) {
     
        res.json({
          position: position,
          budget: data.user.budget
        });
      });

    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });
};
