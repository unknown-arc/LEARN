-- Q2. EXISTS Clause
-- Find students who have taken all courses offered by the Computer Science department.

SELECT
    s.student_id,
    s.s_name,
    s.dept_name,
    s.tot_cred
FROM student AS s
WHERE EXISTS (
    -- Require at least one Computer Science course.
    SELECT 1
    FROM course AS cs
    WHERE cs.dept_name = 'Computer Science'
)
AND NOT EXISTS (
    -- Find a Computer Science course this student has not taken.
    SELECT 1
    FROM course AS c
    WHERE c.dept_name = 'Computer Science'
      AND NOT EXISTS (
          SELECT 1
          FROM takes AS t
          WHERE t.student_id = s.student_id
            AND t.course_id = c.course_id
      )
);
