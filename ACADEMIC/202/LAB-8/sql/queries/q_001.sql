-- Q1. HAVING Clause
-- Find departments where the average credits of courses offered is more than 3.
-- Display the department name and average credits.

SELECT
    dept_name,
    AVG(credits) AS avg_credits
FROM course
GROUP BY dept_name
HAVING AVG(credits) > 3;
