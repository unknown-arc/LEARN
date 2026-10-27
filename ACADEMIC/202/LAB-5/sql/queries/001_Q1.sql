-- Q1. Names of JR, enrolled class by I. Teach.

SELECT DISTINCT s.sname
FROM Student AS s
JOIN Enrolled AS e ON e.snum = s.snum
JOIN Class AS c ON c.cname = e.cname
JOIN Faculty AS f ON f.fid = c.fid
WHERE s.level = 'JR'
  AND f.fname = 'I. Teach';
