DROP TABLE IF EXISTS store.product;
DROP TABLE IF EXISTS store.coupon;

CREATE SCHEMA IF NOT EXISTS store;

CREATE TABLE IF NOT EXISTS store.product (
    id_product SERIAL PRIMARY KEY,
    description TEXT,
    price NUMERIC
);

INSERT INTO store.product (description, price)
VALUES
    ('A', 1000),
    ('B', 5000),
    ('C', 30);

CREATE TABLE IF NOT EXISTS store.coupon (
    code TEXT PRIMARY KEY,
    percentage NUMERIC
);

INSERT INTO store.coupon (code, percentage)
VALUES
    ('VALE10', 10),
    ('VALE20', 20),
    ('VALE50', 50);
