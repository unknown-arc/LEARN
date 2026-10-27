-- Q3. Names of all classes that (either meet in R128) or (have 5/5+ students enrolled.)

SELECT c.cname
FROM Class AS c
WHERE c.room = 'R128'
   OR (
       SELECT COUNT(*)
       FROM Enrolled AS e
       WHERE e.cname = c.cname
   ) >= 5;
