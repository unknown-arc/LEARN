-- Q4. Combination of HAVING and EXISTS
-- List courses taken by every student in the Computer Science department.
-- Display the course ID and title.

SELECT
    c.course_id,
    c.title
FROM course AS c
JOIN takes AS t
  ON t.course_id = c.course_id
JOIN student AS s
  ON s.student_id = t.student_id
WHERE s.dept_name = 'Computer Science'
  AND EXISTS (
      -- Ensure at least one Computer Science student exists.
      SELECT 1
      FROM student AS cs
      WHERE cs.dept_name = 'Computer Science'
  )
GROUP BY c.course_id, c.title
HAVING COUNT(DISTINCT s.student_id) = (
    -- Compare the number of students who took this course
    -- with the total number of Computer Science students.
    SELECT COUNT(*)
    FROM student AS cs
    WHERE cs.dept_name = 'Computer Science'
);
