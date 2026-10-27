-- Q2. Age of oldest student, who (either History major) or (enrolled in course by I. Teach.)

SELECT MAX(s.age) AS oldest_age
FROM Student AS s
WHERE s.major = 'History'
   OR s.snum IN (
       SELECT e.snum
       FROM Enrolled AS e
       JOIN Class AS c ON c.cname = e.cname
       JOIN Faculty AS f ON f.fid = c.fid
       WHERE f.fname = 'I. Teach'
   );
