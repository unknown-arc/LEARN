-- DBMS MA 2205 — Assignment 3
-- Schema from the supplied assignment PDF.

CREATE TABLE student (
    snum INTEGER PRIMARY KEY,
    sname VARCHAR(100) NOT NULL,
    major VARCHAR(100) NOT NULL,
    level VARCHAR(2) NOT NULL,
    age INTEGER NOT NULL
);

CREATE TABLE faculty (
    fid INTEGER PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    deptid INTEGER NOT NULL
);

CREATE TABLE class (
    name VARCHAR(50) PRIMARY KEY,
    meets_at TIME NOT NULL,
    room VARCHAR(20) NOT NULL,
    fid INTEGER NOT NULL,
    CONSTRAINT fk_class_faculty
        FOREIGN KEY (fid)
        REFERENCES faculty (fid)
);

CREATE TABLE enrolled (
    snum INTEGER NOT NULL,
    cname VARCHAR(50) NOT NULL,
    PRIMARY KEY (snum, cname),
    CONSTRAINT fk_enrolled_student
        FOREIGN KEY (snum)
        REFERENCES student (snum),
    CONSTRAINT fk_enrolled_class
        FOREIGN KEY (cname)
        REFERENCES class (name)
);
