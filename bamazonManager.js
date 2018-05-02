const mysql = require('mysql'); 
const initial = require('inquirer'); 


bamzonFig(); 
setTimeout(initialize, 1000); 

function initialize() {
  initial.prompt([
    {
      type: 'list', 
      message: 'Choose from the options below:', 
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
      name: 'menuItem'
    }
  ]).then(initialInput => {
    switch (initialInput.menuItem) {
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
}; //initialize

function viewAllProducts() {
  // If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

}

function viewLowInventory() {
  // If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

}

function addInventory() {
  // If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

}

function addProduct() {
  // If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
  
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