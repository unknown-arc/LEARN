-- Q5. Nested Subquery with EXISTS
-- Find students who have taken at least one course with every instructor
-- in their own department.
--
-- A course is considered taken with an instructor when the student took it
-- in the same semester and year in which that instructor taught it.

SELECT
    s.student_id,
    s.s_name,
    s.dept_name
FROM student AS s
WHERE EXISTS (
    -- Require at least one instructor in the student's department.
    SELECT 1
    FROM instructor AS i
    WHERE i.dept_name = s.dept_name
)
AND NOT EXISTS (
    -- Find an instructor in the student's department for whom
    -- no matching course taken by this student can be found.
    SELECT 1
    FROM instructor AS i
    WHERE i.dept_name = s.dept_name
      AND NOT EXISTS (
          SELECT 1
          FROM takes AS t
          JOIN teaches AS th
            ON th.course_id = t.course_id
           AND th.semester = t.semester
           AND th.teaches_year = t.takes_year
          WHERE t.student_id = s.student_id
            AND th.instructor_id = i.instructor_id
      )
);
