CREATE TABLE Student (
    snum INTEGER PRIMARY KEY,
    sname VARCHAR(50) NOT NULL,
    major VARCHAR(50) NOT NULL,
    level VARCHAR(2) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0)
);

CREATE TABLE Faculty (
    fid INTEGER PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    deptid INTEGER NOT NULL
);

CREATE TABLE Class (
    cname VARCHAR(20) PRIMARY KEY,
    fid INTEGER NOT NULL REFERENCES Faculty(fid),
    room VARCHAR(20) NOT NULL,
    meeting_time VARCHAR(30) NOT NULL
);

CREATE TABLE Enrolled (
    snum INTEGER NOT NULL REFERENCES Student(snum),
    cname VARCHAR(20) NOT NULL REFERENCES Class(cname),
    PRIMARY KEY (snum, cname)
);
