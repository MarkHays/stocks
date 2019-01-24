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
    db.Users.create({ user_id: user.user_id, name: user.name, budget: user.budget }).then(function (record) {
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

  //get position for speicific user_id
  app.get("/api/positions/:user_id", function (req, res) {
    var userId = req.params.user_id

    db.Users.findOne({ where: { user_id: userId } }).then(function (user) {
      db.Positions.findAll({ where: { user_id: userId }, include: [Users] }).then(function (records) {
        res.render("userPosition", {
          user_id: user.get("user_id"),
          name: user.get("name"),
          budget: user.get("budget"),
          positions: records
        });

      });
    });
  });

  function enterNewPosition(user, quantity, symbol) {
    if (quantity < 1) {
      throw "ILLEGAL TRANSATION";
    }
    Positions.create({
      user_id: user.user_id,
      symbol: symbol,
      quantity: quantity
    });
  }

  function changePosition(position, quantity, buying) {
    var i = -1;
    if (buying) i = 1;

    var newQuantity = position.quantity + i * quantity;

    if (newQuantity < 0) {
      console.log("not enough shares");
    } else {
      position.quantity += i * quantity;
    }

    if (position.quantity === 0) {
      Positions.destroy({
        where: {
          user_id: position.user_id,
          symbol: position.symbol
        }
      })
    } else {
      position.save().then(function () {
        console.log("new position is " + position.quantity + " shares of " + position.symbol);
      });
    }
  }

  function changeMoney(user, price, b) {
    var i = 1;

    if (b) {
      i = -1;
    }
    var budget = user.budget;
    var newBudget = budget + i * price;


    if (newBudget < 0) {

      console.log("you cant afford that");
    } else {
      user.budget = newBudget
    }
    user.save().then(function () {
      console.log("new budget is " + user.budget);
    });

  }

  app.post("/api/develop/reset/", function (req, res) {
    Users.destroy({ where: {}, truncate: true });
    Positions.destroy({ where: {}, truncate: true });

    Users.create({
      user_id: "f",
      budget: 300
    });
    Positions.create({
      user_id: "f",
      symbol: "aapl",
      quantity: 1
    });
    console.log("reset complete")
  });

  app.post("/api/purchase/", function (req, res) {

    var body = req.body;
    var symbol = body.symbol;
    var price = body.price;
    var user_id = body.user_id;
    var buying = body.buying == 'true';

    Users.findAll({
      where: {
        user_id: user_id
      }
    }).then(function (users) {
      var user = users[0];

      changeMoney(user, price, buying);

      Positions.findAll({
        where: {
          user_id: user_id,
          symbol: symbol
        }
      }).then(function (userPositions) {

        if (userPositions.length === 0) {
          enterNewPosition(user, 1, symbol);
        } else {
          changePosition(userPositions[0], 1, buying);
        }
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
