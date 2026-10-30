
-- Academic Management System Database Schema

-- 1. STUDENT
CREATE TABLE student (
    student_id INTEGER PRIMARY KEY,
    s_name VARCHAR(255) NOT NULL,
    dept_name VARCHAR(255) NOT NULL,
    tot_cred INTEGER NOT NULL CHECK (tot_cred >= 0)
);

-- 2. COURSE
CREATE TABLE course (
    course_id VARCHAR(10) PRIMARY KEY
        CHECK (course_id = UPPER(course_id)),
    title VARCHAR(255) NOT NULL,
    dept_name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0)
);

-- 3. INSTRUCTOR
CREATE TABLE instructor (
    instructor_id INTEGER PRIMARY KEY,
    instructor_name VARCHAR(255) NOT NULL,
    dept_name VARCHAR(255) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL CHECK (salary > 0)
);

-- 4. TAKES
CREATE TABLE takes (
    student_id INTEGER NOT NULL,
    course_id VARCHAR(10) NOT NULL
        CHECK (course_id = UPPER(course_id)),
    semester VARCHAR(6) NOT NULL
        CHECK (semester IN ('Spring', 'Summer', 'Fall')),
    takes_year INTEGER NOT NULL
        CHECK (takes_year >= 2020),
    grade CHAR(1) NOT NULL
        CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),

    PRIMARY KEY (student_id, course_id, semester, takes_year),

    CONSTRAINT fk_takes_student
        FOREIGN KEY (student_id)
        REFERENCES student(student_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_takes_course
        FOREIGN KEY (course_id)
        REFERENCES course(course_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 5. TEACHES
CREATE TABLE teaches (
    instructor_id INTEGER NOT NULL,
    course_id VARCHAR(10) NOT NULL
        CHECK (course_id = UPPER(course_id)),
    semester VARCHAR(6) NOT NULL
        CHECK (semester IN ('Spring', 'Summer', 'Fall')),
    teaches_year INTEGER NOT NULL
        CHECK (teaches_year >= 2020),

PRIMARY KEY (instructor_id, course_id, semester, teaches_year),

    CONSTRAINT fk_teaches_instructor
        FOREIGN KEY (instructor_id)
        REFERENCES instructor(instructor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_teaches_course
        FOREIGN KEY (course_id)
        REFERENCES course(course_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
