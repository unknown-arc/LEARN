-- Q8. Find the names of students who are enrolled
-- in the maximum number of classes.

SELECT s.sname
FROM student s
JOIN enrolled e
    ON s.snum = e.snum
GROUP BY s.snum, s.sname
HAVING COUNT(*) >= ALL (
    SELECT COUNT(*)
    FROM enrolled
    GROUP BY snum
);