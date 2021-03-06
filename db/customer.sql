DROP TABLE customer;

CREATE TABLE customer (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    account varchar(10),
    community varchar(100),
    email varchar(100),
    phone varchar(20),
    status varchar(10) NOT NULL,
    notes varchar(500),
    PRIMARY KEY (ID),
    UNIQUE (ID)
);