-- Q5. Find the names of faculty members for whom
-- the combined enrollment of the courses that they teach is less than five.

SELECT f.fname
FROM faculty f
JOIN class c
    ON f.fid = c.fid
JOIN enrolled e
    ON c.name = e.cname
GROUP BY f.fid, f.fname
HAVING COUNT(*) < 5;