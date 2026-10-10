-- Q4. Find managerids of managers who manage only departments
-- with budgets greater than $1,000,000.
SELECT DISTINCT d.managerid
FROM Dept AS d
WHERE NOT EXISTS (
    SELECT 1
    FROM Dept AS d2
    WHERE d2.managerid = d.managerid
      AND d2.budget <= 1000000
)
ORDER BY d.managerid;
