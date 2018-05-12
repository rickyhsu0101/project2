-- populate users table with premade data
USE simulation_db;
INSERT INTO users(userId, username, email, password, friends)
VALUES(222, "johnDoe", "johnDoe@gmail.com", "defaultPass","123,387");

INSERT INTO users(userId, username, email, password, friends)
VALUES(123, "georgeBush", "georgeBush@yahoo.com","defaultPass", "222,387");

INSERT INTO users(userId, username, email, password, friends)
VALUES(387, "obama123", "obama@gmail.com", "defaultPass","123,222");

-- select member from all users
USE simulation_db;
SELECT * FROM users;

-- create table for each user
USE simulation_db;
DROP TABLE IF EXISTS johnDoe;
DROP TABLE IF EXISTS georgeBush;
DROP TABLE IF EXISTS obama123;
DROP TABLE IF EXISTS johnDoe;
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
-- population chat_room
USE simulation_db;
INSERT INTO chat_room(roomId, roomName, members)
VALUES (23141, "Rando-Chat", "123,222,387");

INSERT INTO chat_room(roomId, roomName, members)
VALUES (23287, "President-Chat","123,387");
-- populate premade messages for all users
USE simulation_db;
INSERT INTO 123_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23141, "222,387", "Rando-Chat", "Yo type in all your names?", 1410715000000);

INSERT INTO 222_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23141, "123,387", "Rando-Chat", "Yea my name is John Doe, the best", 1410715060000);

INSERT INTO 387_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23141, "123,222", "Rando-Chat", "Yea my name is Obame, the best president ever imo.", 1410715080000);

-- populate premade messages for two users
USE simulation_db;
INSERT INTO 387_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23287, "123", "President-Chat", "Hey Bush, lets kill this john doe dude", 1410715030000);

INSERT INTO 123_chat(roomId, groupMembers, groupName, messageContent, time)
VALUES (23287, "387", "President-Chat", "Yea I agree", 1410715090000);


USE simulation_db;
SELECT * FROM users;
SELECT * FROM 123_chat;
SELECT * FROM 222_chat;
SELECT * FROM 387_chat;
SELECT * FROM chat_room;


USE simulation_db;

DELETE FROM users
WHERE username = 'rickyhsu0101';
USE simulation_db;
DROP TABLE 392_chat;
SELECT * FROM users;

DROP TABLE 390_chat;
DROP TABLE 391_chat;
DROP TABLE georgebush_chat;
DROP TABLE johndoe_chat;
DROP TABLE obama123_chat;