-- Q4. Find the ACC_NO and S_NAME of books
-- whose price is greater than the price of a book
-- supplied by TechBooks Pvt Ltd.

SELECT t.acc_no, t.s_name
FROM s_by t, s_by s
WHERE t.price > s.price
  AND s.s_name = 'TechBooks Pvt Ltd';