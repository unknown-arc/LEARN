-- Q4. Find the names of all students who are enrolled
-- in two classes that meet at the same time.

SELECT DISTINCT s.sname
FROM student s
JOIN enrolled e1
    ON s.snum = e1.snum
JOIN class c1
    ON e1.cname = c1.name
JOIN enrolled e2
    ON s.snum = e2.snum
JOIN class c2
    ON e2.cname = c2.name
WHERE c1.name <> c2.name
  AND c1.meets_at = c2.meets_at;