-- Q9. Find the names of students who are not enrolled
-- in any class.

SELECT sname
FROM student
WHERE snum NOT IN (
    SELECT snum
    FROM enrolled
);