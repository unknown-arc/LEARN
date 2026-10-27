-- Q7. Print the Level and the average age of students
-- for that Level, for all Levels except JR.

SELECT level, AVG(age) AS average_age
FROM student
WHERE level <> 'JR'
GROUP BY level;