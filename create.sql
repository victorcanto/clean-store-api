DROP TABLE IF EXISTS store.coupon;
DROP TABLE IF EXISTS store.item;
DROP TABLE IF EXISTS store.product;
DROP TABLE IF EXISTS store.order;
CREATE SCHEMA IF NOT EXISTS store;
CREATE TABLE IF NOT EXISTS store.product (
    id_product SERIAL PRIMARY KEY,
    description TEXT,
    price NUMERIC,
    width INTEGER,
    height INTEGER,
    length INTEGER,
    weight NUMERIC,
    currency TEXT
);
INSERT INTO store.product (
        description,
        price,
        width,
        height,
        length,
        weight,
        currency
    )
VALUES ('A', 1000, 100, 30, 10, 3, 'BRL'),
    ('B', 5000, 50, 50, 50, 22, 'BRL'),
    ('C', 30, 10, 10, 10, 0.9, 'BRL'),
    ('D', 100, 100, 30, 10, 3, 'USD');
CREATE TABLE IF NOT EXISTS store.coupon (
    code TEXT PRIMARY KEY,
    percentage NUMERIC,
    expire_date TIMESTAMP
);
INSERT INTO store.coupon (code, percentage, expire_date)
VALUES ('VALE10', 10, '2025-01-01T00:00:00'),
    ('VALE20', 20, '2025-01-01T00:00:00'),
    ('VALE50_EXPIRED', 50, '2024-01-01T00:00:00');
CREATE TABLE IF NOT EXISTS store.order (
    id_order SERIAL PRIMARY KEY,
    coupon_code TEXT,
    coupon_percentage NUMERIC,
    code TEXT,
    cpf TEXT,
    issue_date TIMESTAMP,
    freight NUMERIC,
    total NUMERIC,
    sequence INTEGER
);
CREATE TABLE IF NOT EXISTS store.item (
    id_order INTEGER REFERENCES store.order(id_order),
    id_product INTEGER REFERENCES store.product(id_product),
    price NUMERIC,
    quantity INTEGER,
    PRIMARY KEY (id_order, id_product)
);