-- Q6. If a manager manages more than one department, they control
-- the sum of those department budgets. Find managerids who control
-- more than $5,000,000.
SELECT managerid
FROM Dept
GROUP BY managerid
HAVING COUNT(*) > 1
   AND SUM(budget) > 5000000
ORDER BY managerid;
