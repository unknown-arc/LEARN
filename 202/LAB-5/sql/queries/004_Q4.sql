-- Q4. Names all students who enrolled in 2 classes that meets same time.

SELECT DISTINCT s.sname
FROM Student AS s
JOIN Enrolled AS e1 ON e1.snum = s.snum
JOIN Class AS c1 ON c1.cname = e1.cname
JOIN Enrolled AS e2 ON e2.snum = s.snum AND e2.cname > e1.cname
JOIN Class AS c2 ON c2.cname = e2.cname
WHERE c1.meeting_time = c2.meeting_time;
