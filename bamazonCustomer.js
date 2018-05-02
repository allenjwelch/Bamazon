const mysql = require('mysql'); 
const initial = require('inquirer'); 
const figlet = require('figlet');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306, 
  user: 'root', 
  password: 'root', 
  database: 'bamazon_db'
}); 

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306, 
  user: 'root', 
  password: 'root', 
  database: 'bamazon_db'
}); 

bamazonFig(); 
setTimeout(showProducts, 1000); 

function showProducts() {
pool.getConnection(function(err, connection) {
  if (err) throw err; 
  console.log(`Connected to Bamazon as customer# ${connection.threadId}\n`); 
  connection.query(`SELECT * FROM products`, function(err,res) {
    console.log('=======================================');
    res.forEach(item => {
      console.log(`Id: ${item.item_id} || Item: ${item.product_name} || Department: ${item.department_name} || Price: $${item.price}`); 
    }); // res.forEach
    console.log('=======================================\n');
  }); //connection.query
  connection.release();   
  setTimeout(custBuy, 1000); 
}); // pool.getConnection
}; 

function custBuy() {
  initial.prompt([
    {
      type: 'input', 
      message: 'Enter the Id# of the Item you would like to purchase:', 
      name: 'itemId'
    }, {
      type: 'input', 
      message: 'How many units of this item would you like?', 
      name: 'itemQuant'
    }
  ]).then(custItem => {
      connection.query(`SELECT * FROM products WHERE item_id = ${custItem.itemId}`, function(err,res) {
      if (res[0].stock_quantity > custItem.itemQuant) {
        console.log('You\'re in luck, we have plenty in stock!'); 
        let newQuant = res[0].stock_quantity - custItem.itemQuant; 
        let custPrice = custItem.itemQuant * res[0].price; 
        let custProduct = res[0].product_name; 
        
        connection.query(`UPDATE products SET stock_quantity = ${newQuant} WHERE item_id = ${custItem.itemId}`, function(err,res) {
          console.log(`Your purchase of ${custItem.itemQuant} ${custProduct}s is $${custPrice}`); 
          connection.end();   
        }); // connection.query
        } else {
          console.log('Insufficent quantity!\n Please select again'); 
          custBuy(); 
        }
    }); // connection.query
    pool.end();
  }); // initial.prompt
  
  // pool.end()
}; // custBuy


function bamazonFig() {
  figlet('$$$ Bamazon $$$', {
    font: 'big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data)
  });
}










