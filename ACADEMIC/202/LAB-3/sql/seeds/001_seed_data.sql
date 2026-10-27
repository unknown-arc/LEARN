-- DBMS MA 2205 — Assignment 3
-- Seed data reproduced from the supplied assignment PDF.

INSERT INTO student (snum, sname, major, level, age) VALUES
    (1, 'Alice', 'CS', 'JR', 20),
    (2, 'Bob', 'History', 'SR', 22),
    (3, 'Charlie', 'Math', 'JR', 21),
    (4, 'David', 'CS', 'FR', 19),
    (5, 'Emma', 'History', 'SO', 23);

INSERT INTO faculty (fid, fname, deptid) VALUES
    (1, 'I. Teach', 10),
    (2, 'Dr. Smith', 20),
    (3, 'Prof. Lee', 30);

INSERT INTO class (name, meets_at, room, fid) VALUES
    ('CS101', '10:00:00', 'R128', 1),
    ('Math1', '11:00:00', 'R130', 2),
    ('Hist1', '12:00:00', 'R128', 3),
    ('CS102', '10:00:00', 'R130', 1);

INSERT INTO enrolled (snum, cname) VALUES
    (1, 'CS101'),
    (2, 'Hist1'),
    (3, 'Math1'),
    (1, 'Math1'),
    (4, 'CS102'),
    (5, 'Hist1'),
    (3, 'CS101');
