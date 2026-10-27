-- Q8. Names of students, enrolled in max no. of classes.

WITH student_counts AS (
    SELECT s.snum, s.sname, COUNT(e.cname) AS class_count
    FROM Student AS s
    LEFT JOIN Enrolled AS e ON e.snum = s.snum
    GROUP BY s.snum, s.sname
)
SELECT sname
FROM student_counts
WHERE class_count = (SELECT MAX(class_count) FROM student_counts);
