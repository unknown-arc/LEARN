-- Library Database Schema

-- 1. BOOK
CREATE TABLE book (
    acc_no INTEGER PRIMARY KEY,
    yr_pub INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL
);

-- 2. USER
-- "user" is quoted because USER is a PostgreSQL keyword.
CREATE TABLE "user" (
    card_no INTEGER PRIMARY KEY,
    b_name VARCHAR(150) NOT NULL,
    b_addr TEXT
);

-- 3. SUPPLIER
CREATE TABLE supplier (
    s_name VARCHAR(150) PRIMARY KEY,
    s_addr TEXT
);

-- 4. B_BY
-- Represents which user borrowed which book.
CREATE TABLE b_by (
    acc_no INTEGER NOT NULL,
    card_no INTEGER NOT NULL,
    doi DATE NOT NULL,

    PRIMARY KEY (acc_no, card_no, doi),

    CONSTRAINT fk_b_by_book
        FOREIGN KEY (acc_no)
        REFERENCES book (acc_no)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_b_by_user
        FOREIGN KEY (card_no)
        REFERENCES "user" (card_no)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 5. S_BY
-- Represents which supplier supplied which book.
CREATE TABLE s_by (
    acc_no INTEGER NOT NULL,
    s_name VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    dds DATE NOT NULL,

    PRIMARY KEY (acc_no, s_name),

    CONSTRAINT fk_s_by_book
        FOREIGN KEY (acc_no)
        REFERENCES book (acc_no)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_s_by_supplier
        FOREIGN KEY (s_name)
        REFERENCES supplier (s_name)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_s_by_price
        CHECK (price >= 0)
);
