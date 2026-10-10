-- Q5. Find the enames of managers who manage the department(s)
-- with the largest budget.
SELECT DISTINCT e.ename
FROM Emp AS e
JOIN Dept AS d ON d.managerid = e.eid
WHERE d.budget = (SELECT MAX(budget) FROM Dept)
ORDER BY e.ename;
