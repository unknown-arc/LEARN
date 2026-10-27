-- Q3. Find the names of all classes that either meet
-- in room R128 or have five or more students enrolled.

SELECT c.name
FROM class c
WHERE c.room = 'R128'
   OR c.name IN (
       SELECT e.cname
       FROM enrolled e
       GROUP BY e.cname
       HAVING COUNT(*) >= 5
   );