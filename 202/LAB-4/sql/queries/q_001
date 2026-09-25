-- Q1. Find out the CARD_NO of borrowers
-- who have taken a book titled "Database System Concepts".

SELECT card_no
FROM b_by
WHERE acc_no IN (
    SELECT acc_no
    FROM book
    WHERE title = 'Database System Concepts'
);