-- DBMS Assignment 6
-- Tables transcribed from the uploaded assignment PDF.

CREATE TABLE Emp (
    eid INTEGER PRIMARY KEY,
    ename VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    salary NUMERIC(12, 2) NOT NULL
);

CREATE TABLE Works (
    eid INTEGER NOT NULL REFERENCES Emp(eid),
    did INTEGER NOT NULL,
    pct_time INTEGER NOT NULL,
    PRIMARY KEY (eid, did)
);

CREATE TABLE Dept (
    did INTEGER PRIMARY KEY,
    budget NUMERIC(14, 2) NOT NULL,
    managerid INTEGER NOT NULL REFERENCES Emp(eid)
);

ALTER TABLE Works
ADD CONSTRAINT works_dept_fk
FOREIGN KEY (did) REFERENCES Dept(did);
