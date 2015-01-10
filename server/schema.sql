CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  id int(5) NOT NULL auto_increment,
  date TIMESTAMP NOT NULL,
  text varchar(140) NOT NULL,
  roomid int(3) NOT NULL,
  userid int(5) NOT NULL,
  PRIMARY KEY (id)
);

/* Create other tables and define schemas for them here! */

CREATE TABLE rooms (
  id int(3) NOT NULL auto_increment,
  name varchar(25) NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE users (
  id int(5) NOT NULL auto_increment,
  username varchar(15) NOT NULL,
  password varchar(25),
  email varchar(30),
  PRIMARY KEY (id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

