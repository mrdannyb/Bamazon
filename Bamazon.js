var inquirer = require("inquirer");
var mysql = require('mysql');

var invoice = [];
var total = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

storefront();

function storefront() {
  connection.query("SELECT id, product_name, price FROM products", function(err,res) {
    if (err) throw err;
    console.log("Inventory");
    for (i = 0; i < res.length; i++) {
      console.log(res[i].id + ") " + res[i].product_name + ",  " + res[i].price + " gp");
    }
    buy();
  });
};

function buy() {
  console.log("See anything that interests you?");
  inquirer.
    prompt([
      {
        name: "pickID",
        type: "input",
        message: "Type in the id of the product you're interested in\n"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many should I put you down for?"
      }
    ]).then(function(ans) {
      pushInvoice(ans.pickID, ans.quantity);
    })
}

function pushInvoice(prod, amount) {
  var query = connection.query("SELECT * FROM products WHERE id = ?", [prod], function(err, res) {
    var num = parseInt(res[0].stock_quantity) - parseInt(amount);
    if (num > -1) {
      update(prod,num);
      var Li = new sale(prod, res[0].product_name, parseInt(res[0].price), parseInt(amount));
      invoice.push(Li);
    } else {
      inquirer.
        prompt([
          {
            name: "insufficient",
            type: "confirm",
            message: "The delivery caravan hasn't arrived yet, so we don't have enough " + res[0].product_name + ". Want to buy the " + res[0].stock_quantity + " we have?"
          }
        ]).then(function(answer) {
          if (answer.insufficient) {
            var Li = new sale(prod, res[0].product_name, parseInt(res[0].price), parseInt(res[0].stock_quantity));
            update(prod,0);
            invoice.push(Li);
          } else {
            console.log("Let's just forget about this then?");
            promptDone();
          }
        })
    }
  })
}

function update(prod, amount) {
  connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [amount, prod], function(err, res) {
    if (err) throw err;
  });
  promptDone();
}

function promptDone() {
  inquirer.
    prompt([
      {
        name: "done" ,
        type: "list",
        message: "Interested in something else? or Shall we head to checkout?",
        choices: ["shop", "checkout"]
      }
    ]).then(function(answer) {
      if (answer.done === "shop") {
        storefront();
      } else {
        invoicing();
      }
    })
}

function invoicing() {
  console.log("-----Order Summary-----\n");
  for (i = 0; i < invoice.length; i++) {
    var sub = parseInt(invoice[i].price) * parseInt(invoice[i].quantity);
    console.log(invoice[i].product_name + " " + invoice[i].price + " x " + invoice[i].quantity + " = " + sub + " gp\n");
    total = total + sub;
    connection.query("UPDATE products SET product_sales = ? WHERE id = ?", [sub, invoice[i].id], function(err) {
      if (err) throw err;
    })
  }
  console.log("Your total invoice for this purchase: " + total + " gp");
  console.log("Thanks for shopping MagI Express");
  connection.end();
}

function sale(id, prodName, cost, amount) {
  this.id = id;
  this.product_name = prodName;
  this.price = cost;
  this.quantity = amount;
}
