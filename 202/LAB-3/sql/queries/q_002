-- Q2. Find the age of the oldest student who is either
-- a History major or is enrolled in a course taught by I. Teach.

SELECT MAX(s.age) AS oldest_age
FROM student s
WHERE s.major = 'History'
   OR s.snum IN (
       SELECT e.snum
       FROM enrolled e
       JOIN class c
           ON e.cname = c.name
       JOIN faculty f
           ON c.fid = f.fid
       WHERE f.fname = 'I. Teach'
   );