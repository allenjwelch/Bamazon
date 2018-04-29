const mysql = require('mysql'); 
const initial = require('inquirer'); 

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
  setTimeout(custBuy, 2000); 
}); // connection.connect


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
        
    // connection.end();


    connection.query(`UPDATE products SET stock_quantiy = ${newQuant} WHERE item_id = ${custItem.itemId}`, function(err,res) {
      console.log(res); 
    }); // connection.query
    } else {
      console.log('Insufficent quantiy!'); 
    }

    }); // connection.query

    ///////////////////////////////////
    // connection.query(`SELECT * FROM products `, function(err,res) {
    //   console.log(res)
    // }); // connection.query
    // connection.end();  
    //////////////////////////////////// 

  }); // initial.prompt
  
  pool.end()
}; 
