CREATE DATABASE bamazon_db; 

USE bamazon_db; 

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL, 
  department_name VARCHAR(50) NOT NULL, 
  price DECIMAL(5,2) NOT NULL,
  stock_quantity INT(100),
  primary key(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
('Bike', 'Outdoors', 150.00, 10), 
('Chair', 'Household', 49.99, 12), 
('Cooler', 'Outdoors', 19.99, 20), 
('Rug', 'Household', 10.00, 15), 
('Television', 'Electronics', 299.99, 18), 
('Monitor', 'Electronics', 90.50, 9), 
('Speakers', 'Electronics', 75.50, 24), 
('Grill', 'Outdoors', 69.99, 4), 
('Socks', 'Clothing', 5.99, 22), 
('Pants', 'Clothing', 18.50, 18); 

SELECT * FROM bamazon_db.products