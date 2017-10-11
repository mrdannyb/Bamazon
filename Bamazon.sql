CREATE DATABASE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price FLOAT(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL
  product_sales FLOAT(10,2) NOT NULL DEFAULT 0
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("Green potion", "potions", 50, 24),
    ("Blue potion", "potions", 75, 12),
    ("Ring of fire", "jewelry", 500, 6),
    ("Necklace of the wind", "jewelry", 12000, 100),
    ("Ground up dragon tooth", "spell components", 7.25, 1000),
    ("Bracers of Moonwalking", "armor", 2424, 12),
    ("Dagger of hidden pain", "close range", 6500, 2),
    ("Eye of Baslisk", "spell components", 54, 750),
    ("Twisted echos", "spell components", 3, 7500)
