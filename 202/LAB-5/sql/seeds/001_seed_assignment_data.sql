INSERT INTO Student (snum, sname, major, level, age) VALUES
(1, 'Alice',   'CS',      'JR', 20),
(2, 'Bob',     'History', 'SR', 22),
(3, 'Charlie', 'Math',    'JR', 21),
(4, 'David',   'CS',      'FR', 19),
(5, 'Emma',    'History', 'SO', 23);

INSERT INTO Faculty (fid, fname, deptid) VALUES
(1, 'I. Teach', 10),
(2, 'Dr. Smith', 20),
(3, 'Prof. Lee', 30);

INSERT INTO Class (cname, fid, room, meeting_time) VALUES
('CS101',  1, 'R128', 'Mon 09:00'),
('CS102',  2, 'R210', 'Tue 10:00'),
('Hist1',  1, 'R220', 'Mon 09:00'),
('Math1',  3, 'R128', 'Tue 10:00');

INSERT INTO Enrolled (snum, cname) VALUES
(1, 'CS101'),
(2, 'Hist1'),
(3, 'Math1'),
(1, 'Math1'),
(4, 'CS102'),
(5, 'Hist1'),
(3, 'CS101');
