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
    percentage NUMERIC,
    expire_date TIMESTAMP
);

INSERT INTO store.coupon (code, percentage, expire_date)
VALUES
    ('VALE10', 10, '2025-01-01T00:00:00'),
    ('VALE20', 20, '2025-01-01T00:00:00'),
    ('VALE50_EXPIRED', 50, '2024-01-01T00:00:00');
