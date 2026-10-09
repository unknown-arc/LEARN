-- Q7. Print (Level + average age) of students, for all Levels except JR.

SELECT level, AVG(age) AS average_age
FROM Student
WHERE level <> 'JR'
GROUP BY level
ORDER BY level;