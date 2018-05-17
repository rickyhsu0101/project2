DROP DATABASE IF EXISTS olqeekbcp7xt59wu;
CREATE DATABASE olqeekbcp7xt59wu;
USE olqeekbcp7xt59wu;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    userId INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    friends TEXT,
    groups TEXT,
    PRIMARY KEY(userId)
);

DROP TABLE IF EXISTS chat_room;
CREATE TABLE chat_room(
    roomId INT AUTO_INCREMENT,
    roomName VARCHAR(100),
    members TEXT,
    PRIMARY KEY(roomId)
);

DROP TABLE IF EXISTS groups;
CREATE TABLE groups(
    groupId INT AUTO_INCREMENT,
    groupDesc TEXT,
    groupName VARCHAR(255),
    groupMembers TEXT,
    chatId INT NOT NULL,
    PRIMARY KEY(groupId)
);

SELECT * FROM groups;
SELECT * FROM users;