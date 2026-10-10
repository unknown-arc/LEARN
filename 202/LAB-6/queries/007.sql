-- Q7. Find the managerids of managers who control the largest amount.
-- Control amount is the sum of budgets of all departments they manage.
WITH manager_totals AS (
    SELECT managerid, SUM(budget) AS total_budget
    FROM Dept
    GROUP BY managerid
)
SELECT managerid
FROM manager_totals
WHERE total_budget = (SELECT MAX(total_budget) FROM manager_totals)
ORDER BY managerid;
