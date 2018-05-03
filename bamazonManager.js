const mysql = require('mysql'); 
const menu = require('inquirer'); 
const addIn = require('inquirer'); 
const addProd = require('inquirer'); 
const figlet = require('figlet'); 
let newQuant = ''; 
let id = ''; 

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306, 
  user: 'root', 
  password: 'root', 
  database: 'bamazon_db'
}); 

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306, 
  user: 'root', 
  password: 'root', 
  database: 'bamazon_db'
});


bamazonFig(); 
setTimeout(menuQs, 1000); 

function menuQs() {
  menu.prompt([
    {
      type: 'list', 
      message: 'Choose from the options below:', 
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
      name: 'menuItem'
    }
  ]).then(menuInput => {
    switch (menuInput.menuItem) {
      case 'View Products for Sale':
        viewAllProducts(); 
        break; 
      case 'View Low Inventory':
        viewLowInventory(); 
        break; 
      case 'Add to Inventory':
        addInventory(); 
        break; 
      case 'Add New Product':
        addProduct(); 
        break; 
      default:
        console.log('How did you even select that?')
    }; // switch 
  }); //initial.prompt
}; //menu

function viewAllProducts() {
  // If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
  connection.query(`SELECT * FROM products`, function(err,res) {
    if (err) throw err; 
    console.log('\n=================================================');
    res.forEach(item => {
      console.log(`Id: ${item.item_id} || Item: ${item.product_name} || Price: $${item.price} || Quantity: ${item.stock_quantity}`); 
    }); // res.forEach
    console.log('=================================================\n');
  }); //connection.query
  connection.end();  
}; // viewAllProducts

function viewLowInventory() {
  // If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
  connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, function(err,res) {
    if (err) throw err; 
    console.log('\n=================================================');
    res.forEach(item => {
      console.log(`Id: ${item.item_id} || Item: ${item.product_name} || Price: $${item.price} || Quantity: ${item.stock_quantity}`); 
    }); // res.forEach
    console.log('=================================================\n');
  }); //connection.query
  connection.end();  
}; // viewLowInventory

function addInventory() {
  // If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
  addIn.prompt([
    {
      type: 'input', 
      message: 'Enter the Id# of the Item:', 
      name: 'itemId'
    }, {
      type: 'input', 
      message: 'How many units of this item would you like to add?', 
      name: 'itemAdd'
    }
  ]).then(addItem => {
    pool.getConnection(function(err, connection) {
      if (err) throw err; 
      connection.query(`SELECT * FROM products WHERE item_id = ${addItem.itemId}`, function(err,res) {
        if (err) throw err; 
        newQuant = parseFloat(addItem.itemAdd) + res[0].stock_quantity;  
        id = addItem.itemId; 
        console.log(`Item: ${res[0].product_name}\nCurrent Quantitiy: ${res[0].stock_quantity}\nUpdated Quantity:${newQuant}`); 
      }); //connection.query
      connection.release();  
      setTimeout(updateInvent,500); 
    }); // pool.getConnection
  }); 

}; //addInventory

function updateInvent() {
  connection.query(`UPDATE products SET stock_quantity = ${newQuant} WHERE item_id = ${id}`, function(err,res) {
    if (err) throw err; 
    console.log(`Item updated!`);
  }); //connection.query
  connection.end(); 

  // setTimeout(endAll,500); 
}

function addProduct() {
  // If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
  addProd.prompt([
    {
      type: 'input', 
      message: 'Enter the a name of the new item:', 
      name: 'itemName'
    },{
      type: 'list', 
      message: 'What department is this item with?:', 
      choices: ['Outdoors', 'Household', 'Electronics', 'Clothing'],
      name: 'itemDep'
    },{
      type: 'input', 
      message: 'What is the price of your item?', 
      name: 'itemPrice'
    },{
      type: 'input', 
      message: 'How many items are being stocked?', 
      name: 'itemStock'
    },
  ]).then(product => {
    let price = parseFloat(product.itemPrice); 
    let stock = parseFloat(product.itemStock);
    connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${product.itemName}', '${product.itemDep}', ${price}, ${stock})`, function(err,res) {
      if (err) throw err; 
      console.log(`Item Added!`);
    }); //connection.query
    connection.end(); 
  }); 
}; 

function endAll() {
  connection.end(); 
}

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
    console.log('Welcome to Manager Access')
  });
}