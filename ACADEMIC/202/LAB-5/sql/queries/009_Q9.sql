-- Q9. Names of students, Not enrolled in any class.

SELECT s.sname
FROM Student AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM Enrolled AS e
    WHERE e.snum = s.snum
);
