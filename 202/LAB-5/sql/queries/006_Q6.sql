-- Q6. Print (Level + the average age) of students, for each Level.

SELECT level, AVG(age) AS average_age
FROM Student
GROUP BY level
ORDER BY level;
