-- populate users table with premade data
USE simulation_db;
INSERT INTO users(userId, username, email, password, friends, groups)
VALUES(222, "johnDoe", "johnDoe@gmail.com", "defaultPass","123,387", "1111");

INSERT INTO users(userId, username, email, password, friends, groups)
VALUES(123, "georgeBush", "georgeBush@yahoo.com","defaultPass", "222,387", "1111,1112");

INSERT INTO users(userId, username, email, password, friends, groups)
VALUES(387, "obama123", "obama@gmail.com", "defaultPass","123,222", "1111,1112");

-- create chat table for each user
USE simulation_db;
CREATE TABLE 222_chat(
    messageId INT AUTO_INCREMENT,
    roomId INT NOT NULL,
    groupMembers TEXT NOT NULL,
    groupName VARCHAR(30),
    messageContent TEXT NOT NULL,
    time BIGINT NOT NULL,
    PRIMARY KEY(messageId)
);

CREATE TABLE 123_chat(
    messageId INT AUTO_INCREMENT,
    roomId INT NOT NULL,
    groupMembers TEXT NOT NULL,
    groupName VARCHAR(30),
    messageContent TEXT NOT NULL,
    time BIGINT NOT NULL,
    PRIMARY KEY(messageId)
);

CREATE TABLE 387_chat(
    messageId INT AUTO_INCREMENT,
    roomId INT NOT NULL,
    groupMembers TEXT NOT NULL,
    groupName VARCHAR(30),
    messageContent TEXT NOT NULL,
    time BIGINT NOT NULL,
    PRIMARY KEY(messageId)
);

-- add groups to groups table
USE simulation_db;
INSERT INTO groups(groupId, groupName, groupMembers, chatId)
VALUES(1111, "Random Group", "123,222,387", 23141);
INSERT INTO groups(groupId, groupName, groupMembers, chatId)
VALUES(1112, "Presdient Group", "123,387", 23287);

-- create group info and tasks table
USE simulation_db;
DROP TABLE IF EXISTS group_1111_info;
DROP TABLE IF EXISTS group_1112_info;
CREATE TABLE group_1111_info(
    member INT NOT NULL,
    position VARCHAR(100),
    points BIGINT NOT NULL,
    level BIGINT NOT NULL
);
CREATE TABLE group_1112_info(
    member INT NOT NULL,
    position VARCHAR(100),
    points BIGINT NOT NULL,
    level BIGINT NOT NULL
);
-- create tasks tables
USE simulation_db;
DROP TABLE IF EXISTS group_1111_task;
DROP TABLE IF EXISTS group_1112_task;
CREATE TABLE group_1111_task(
    taskId INT AUTO_INCREMENT,
    taskName VARCHAR(100) NOT NULL,
    taskDesc TEXT,
    taskPoints BIGINT DEFAULT 0,
    completedMembers TEXT,
    successMembers TEXT,
    failureMembers TEXT,
    submitTime TEXT,
    retry BOOL DEFAULT true,
    PRIMARY KEY(taskId)
);
CREATE TABLE group_1112_task(
    taskId INT AUTO_INCREMENT,
    taskName VARCHAR(100),
    taskDesc TEXT,
    taskPoints BIGINT DEFAULT 0,
    completedMembers TEXT,
    successMembers TEXT,
    failureMembers TEXT,
    submitTime TEXT,
    retry BOOL DEFAULT true,
    PRIMARY KEY(taskId)
);

-- populate premade info
USE simulation_db;
INSERT INTO group_1111_info(member, position, points, level)
VALUES (222, "admin", 1000, 20);
INSERT INTO group_1111_info(member, position, points, level)
VALUES (123, "member", 500, 10);
INSERT INTO group_1111_info(member, position, points, level)
VALUES (387, "member", 400, 8);

USE simulation_db;
INSERT INTO group_1112_info(member, position, points, level)
VALUES (123, "admin", 2000, 40);
INSERT INTO group_1112_info(member, position, points, level)
VALUES (387, "member", 400, 8);

USE simulation_db;
INSERT INTO chat_room(roomId, roomName, members)
VALUES (23141, "Rando-Chat", "123,222,387");

INSERT INTO chat_room(roomId, roomName, members)
VALUES (23287, "President-Chat","123,387");

-- populate premade tasks
USE simulation_db;
INSERT INTO group_1111_task(taskName, taskDesc, taskPoints, completedMembers, successMembers, failureMembers, submitTime, retry)
VALUES ("Introduction", "Introduce yourself to other members of the group", 1000, "123,222,387", "123,222,387", "", "1410715000000,1410715060000,1410715080000", true);

USE simulation_db;
INSERT INTO group_1112_task(taskName, taskDesc, taskPoints, completedMembers, successMembers, failureMembers, submitTime, retry)
VALUES ("Kill doe", "Somehow Kill John Doe", 2000, "", "", "", "", true);
-- populate premade messages for all users

INSERT INTO 123_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23141, "222,387", "Rando-Chat", "Yo type in all your names?", 1410715000000);

INSERT INTO 222_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23141, "123,387", "Rando-Chat", "Yea my name is John Doe, the best", 1410715060000);

INSERT INTO 387_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23141, "123,222", "Rando-Chat", "Yea my name is Obame, the best president ever imo.", 1410715080000);

-- populate premade messages for two users
INSERT INTO 387_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23287, "123", "President-Chat", "Hey Bush, lets kill this john doe dude", 1410715030000);

INSERT INTO 123_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23287, "387", "President-Chat", "Yea I agree", 1410715090000);


USE simulation_db;
SELECT * FROM group_1111_info;
SELECT * FROM group_1112_info;
SELECT * FROM group_1111_task;
SELECT * FROM group_1112_task;
SELECT * FROM users;
SELECT * FROM 123_chat;
SELECT * FROM 222_chat;
SELECT * FROM 387_chat;
SELECT * FROM chat_room;
SELECT * FROM groups;

SELECT * FROM group_1113_info;
SELECT * FROM group_1113_task;