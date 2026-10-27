-- Q6. Print the Level and the average age of students
-- for that Level, for each Level.

SELECT level, AVG(age) AS average_age
FROM student
GROUP BY level;