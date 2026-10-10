-- Sample data shown in the uploaded assignment PDF.

INSERT INTO Emp (eid, ename, age, salary) VALUES
    (101, 'Alice',   30,  90000),
    (102, 'Bob',     35, 120000),
    (103, 'Charlie', 28,  70000),
    (104, 'David',   40, 150000),
    (105, 'Emma',    32,  95000);

INSERT INTO Dept (did, budget, managerid) VALUES
    (1, 2000000, 104),
    (2, 1500000, 102),
    (3,  800000, 103),
    (4, 3000000, 105);

INSERT INTO Works (eid, did, pct_time) VALUES
    (101, 1,  50),
    (101, 2,  50),
    (102, 1, 100),
    (103, 3, 100),
    (104, 2, 100),
    (105, 4, 100),
    (105, 1,  50);
