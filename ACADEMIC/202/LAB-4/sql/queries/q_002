-- Q2. Find out the NAME and ADDRESS of borrowers
-- who have borrowed a book on 05/03/2026.

SELECT u.b_name, u.b_addr
FROM "user" u, b_by b
WHERE u.card_no = b.card_no
  AND b.doi = '2026-03-05';