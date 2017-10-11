var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

topMenu();

function topMenu() {
  inquirer.
    prompt([
      {
        name: "topChoice",
        type: "rawlist",
        message: "How can I assist you today?",
        choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
      }
    ]).then(function(ans) {
      switch (ans.topChoice) {
        case "View products for sale":
          viewProds();
          break;
        case "View low inventory":
          viewLow();
          break;
        case "Add to inventory":
          addStock();
          break;
        case "Add new product":
          addProduct();
          break;
      }
    })
}

function viewProds() {
  connection.query("SELECT id, product_name, price, stock_quantity FROM products", function(err,res) {
    if (err) throw err;
    console.log("Inventory");
    for (i = 0; i < res.length; i++) {
      console.log(res[i].id + ") " + res[i].product_name + ",  " + res[i].price + " gp  [" + res[i].stock_quantity + "]");
    }
    anythingElse();
  });
}

function anythingElse() {
  inquirer.
    prompt([
      {
        name: "more",
        type: "confirm",
        message: "Can I assist you with anything else?"
      }
    ]).then(function(answer) {
      if (answer.more) {
        topMenu();
      } else {
        connection.end();
        process.exit();
      }
    })
}

function viewLow() {
  connection.query("SELECT id, product_name, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      console.log(res[i].id + ") " + res[i].product_name + " [" + res[i].stock_quantity + "]");
    }
    inquirer.
      prompt([
        {
          name:"low",
          type:"input",
          message:"If you want to add to any of these, type in the id. If not, type 0"
        }
      ]).then(function(ans) {
        if (ans.low === "0") {
          anythingElse();
        } else {
          addStock(ans.low);
        }
      })
  })
}

function addStockPrompt() {
  inquirer.
    prompt([
      {
        name: "known",
        type: "input",
        message: "If you know the id of the product you want to add, type that here. Otherwise type 'list'"
    }]).then(function(ans) {
      if (ans.known.toLowerCase() === "list") {
        connection.query("SELECT id, product_name, stock_quantity FROM products", function(err, res) {
          if (err) throw err;
          console.log(res[i].id + ") " + res[i].product_name + " [" + res[i].stock_quantity + "]");
          addStockPrompt();
        });
      } else {
        addStock(ans.known);
      }
    })
}

function addStock(item) {
  var itemName = "";
  var prestock = 0;
  var diff = 0;
  inquirer.
    prompt([
      {
        name: "amount",
        type: "input",
        message: "How many do you want in stock?"
      }
    ]).then(function(ans) {
      connection.query("SELECT product_name, stock_quantity FROM products where id = ?", [item], function(err, res) {
        if (err) throw err;
        prestock = parseInt(res[0].stock_quantity);
        itemName = res[0].product_name;
        diff = parseInt(ans.amount) - prestock;
      })
      connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [ans.amount,item], function(err) {
        if (err) throw err;
        console.log("Added " + ans.amount + " " + itemName + " to the inventory");
        anythingElse();
      })
    })
}

function addProduct() {
  console.log("Adding a new item...");
  inquirer.
    prompt([
      {
        name: "name",
        type: "input",
        message: "What's the item's name?"
      },
      {
        name: "price",
        type: "input",
        message: "How much are we charging?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many did we get?"
      },
      {
        name: "department",
        type: "input",
        message: "What department does this fit into?"
      }
    ]).then(function(ans) {
      connection.query("INSERT INTO products SET ?",
        { product_name: ans.name,
          price: ans.price,
          stock_quantity: ans.quantity,
          department_name: ans.department},
        function(err) {
          if (err) throw err;
          console.log("Inserted " + ans.name + " into the database");
          anythingElse();
        })
    })

}
