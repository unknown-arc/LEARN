-- Q5. Names of FM, combined enrollment of courses is >5.

SELECT f.fname
FROM Faculty AS f
LEFT JOIN Class AS c ON c.fid = f.fid
LEFT JOIN Enrolled AS e ON e.cname = c.cname
GROUP BY f.fid, f.fname
HAVING COUNT(e.snum) < 5;
