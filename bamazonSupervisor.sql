USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs FLOAT(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
  VALUES ("potions", 3000),("jewelry", 1000), ("spell components", 4500), ("armor", 6050), ("close range", 1200);
