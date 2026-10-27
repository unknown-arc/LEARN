-- Q1. Find the names of all Juniors (Level = JR)
-- who are enrolled in a class taught by I. Teach.

SELECT DISTINCT s.sname
FROM student s
JOIN enrolled e
    ON s.snum = e.snum
JOIN class c
    ON e.cname = c.name
JOIN faculty f
    ON c.fid = f.fid
WHERE s.level = 'JR'
  AND f.fname = 'I. Teach';