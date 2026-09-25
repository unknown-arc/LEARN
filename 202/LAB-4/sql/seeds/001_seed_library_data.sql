-- Sample seed data for the Library Database.

-- 1. BOOK
INSERT INTO book (acc_no, yr_pub, title) VALUES
    (1001, 2018, 'Database System Concepts'),
    (1002, 2020, 'Introduction to Algorithms'),
    (1003, 2019, 'Python for Data Analysis'),
    (1004, 2021, 'Artificial Intelligence: A Modern Approach'),
    (1005, 2017, 'Computer Networks'),
    (1006, 2022, 'Operating System Concepts'),
    (1007, 2016, 'Clean Code'),
    (1008, 2023, 'Machine Learning Basics'),
    (1009, 2019, 'Discrete Mathematics'),
    (1010, 2021, 'Web Development with JavaScript');

-- 2. USER
INSERT INTO "user" (card_no, b_name, b_addr) VALUES
    (2001, 'Aarav Sharma', '12 Lake View Road'),
    (2002, 'Priya Verma', '45 Green Park'),
    (2003, 'Rohan Singh', '18 University Road'),
    (2004, 'Neha Gupta', '27 Station Road'),
    (2005, 'Arjun Mehta', '63 River Side Colony'),
    (2006, 'Isha Patel', '31 Model Town'),
    (2007, 'Kabir Joshi', '9 College Street'),
    (2008, 'Ananya Rao', '72 Garden Avenue');

-- 3. SUPPLIER
INSERT INTO supplier (s_name, s_addr) VALUES
    ('TechBooks Pvt Ltd', '21 Market Road'),
    ('Knowledge House', '14 Library Street'),
    ('Academic Press', '56 Central Avenue'),
    ('Modern Books Supply', '38 Station Market');

-- 4. B_BY
-- Borrowing records: book + user + date of issue.
INSERT INTO b_by (acc_no, card_no, doi) VALUES
    (1001, 2001, '2026-01-10'),
    (1002, 2002, '2026-01-14'),
    (1003, 2003, '2026-02-02'),
    (1004, 2004, '2026-02-18'),
    (1005, 2005, '2026-03-05'),
    (1006, 2006, '2026-03-21'),
    (1007, 2007, '2026-04-03'),
    (1008, 2008, '2026-04-17'),
    (1001, 2003, '2026-05-01'),
    (1002, 2005, '2026-05-12'),
    (1003, 2007, '2026-06-08'),
    (1005, 2001, '2026-06-20');

-- 5. S_BY
-- Supply records: book + supplier + price + date of supply.
INSERT INTO s_by (acc_no, s_name, price, dds) VALUES
    (1001, 'TechBooks Pvt Ltd', 850.00, '2025-11-10'),
    (1002, 'Knowledge House', 1250.00, '2025-11-15'),
    (1003, 'Academic Press', 780.00, '2025-12-02'),
    (1004, 'Academic Press', 1450.00, '2025-12-08'),
    (1005, 'Modern Books Supply', 920.00, '2025-12-15'),
    (1006, 'TechBooks Pvt Ltd', 1100.00, '2026-01-05'),
    (1007, 'Knowledge House', 650.00, '2026-01-12'),
    (1008, 'Academic Press', 990.00, '2026-01-20'),
    (1009, 'Modern Books Supply', 720.00, '2026-02-01'),
    (1010, 'TechBooks Pvt Ltd', 875.00, '2026-02-10');
