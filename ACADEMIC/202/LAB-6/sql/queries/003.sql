-- Q3. Print the name of each employee whose salary exceeds the budget
-- of all departments that they work in.
SELECT DISTINCT e.ename
FROM Emp AS e
WHERE NOT EXISTS (
    SELECT 1
    FROM Works AS w
    JOIN Dept AS d ON d.did = w.did
    WHERE w.eid = e.eid
      AND e.salary <= d.budget
);
