-- Q3. ALL Clause
-- Find instructors whose salary is higher than the salary of every instructor
-- in the Biology department.
--
-- This NOT EXISTS formulation is portable to SQLite and PostgreSQL and is
-- logically equivalent to: salary > ALL (Biology instructor salaries).

SELECT
    i.instructor_name
FROM instructor AS i
WHERE NOT EXISTS (
    SELECT 1
    FROM instructor AS b
    WHERE b.dept_name = 'Biology'
      AND i.salary <= b.salary
);
