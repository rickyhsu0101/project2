-- populate users table with premade data
USE simulation_db;
INSERT INTO users(userId, username, email, password, friends)
VALUES(222, "johnDoe", "johnDoe@gmail.com", "defaultPass","123,387");

INSERT INTO users(userId, username, email, password, friends)
VALUES(123, "georgeBush", "georgeBush@yahoo.com","defaultPass", "222,387");

INSERT INTO users(userId, username, email, password, friends)
VALUES(387, "obama123", "obama@gmail.com", "defaultPass","123,222");

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

INSERT INTO chat_room(roomId, roomName, members)
VALUES (23141, "Rando-Chat", "123,222,387");

INSERT INTO chat_room(roomId, roomName, members)
VALUES (23287, "President-Chat","123,387");
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



SELECT * FROM users;
SELECT * FROM 123_chat;
SELECT * FROM 222_chat;
SELECT * FROM 387_chat;
SELECT * FROM chat_room;
