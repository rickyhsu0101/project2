DROP DATABASE IF EXISTS simulation_db;
CREATE DATABASE simulation_db;
USE simulation_db;

CREATE TABLE users(
    userId INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    friends TEXT,
    PRIMARY KEY(userId)
);

CREATE TABLE chat_room(
    roomId INT AUTO_INCREMENT,
    roomName VARCHAR(100),
    members TEXT,
    PRIMARY KEY(roomId)
);