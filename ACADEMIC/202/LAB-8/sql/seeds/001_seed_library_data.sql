-- Sd data for the Academic Management System Database.

-- 1. STUDENT
INSERT INTO student (student_id, s_name, dept_name, tot_cred) VALUES
    (1, 'Alice', 'Computer Science', 120),
    (2, 'Bob', 'Mathematics', 90),
    (3, 'Charlie', 'Physics', 100);

-- 2. COURSE
INSERT INTO course (course_id, title, dept_name, credits) VALUES
    ('CS101', 'Intro to CS', 'Computer Science', 4),
    ('MATH101', 'Calculus I', 'Mathematics', 3),
    ('PHYS101', 'Physics I', 'Physics', 4);

-- 3. INSTRUCTOR
INSERT INTO instructor (instructor_id, instructor_name, dept_name, salary) VALUES
    (101, 'Dr. Smith', 'Computer Science', 90000.00),
    (102, 'Dr. Johnson', 'Mathematics', 85000.00),
    (103, 'Dr. Lee', 'Physics', 87000.00);

-- 4. TAKES
INSERT INTO takes (student_id, course_id, semester, takes_year, grade) VALUES
    (1, 'CS101', 'Fall', 2024, 'A'),
    (2, 'MATH101', 'Spring', 2024, 'B'),
    (3, 'PHYS101', 'Fall', 2024, 'A');

-- 5. TEACHES
INSERT INTO teaches (instructor_id, course_id, semester, teaches_year) VALUES
    (101, 'CS101', 'Fall', 2024),
    (102, 'MATH101', 'Spring', 2024),
    (103, 'PHYS101', 'Fall', 2024);
