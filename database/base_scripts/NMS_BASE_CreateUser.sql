DROP procedure IF EXISTS `NMS_BASE_CreateUser`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateUser`(IN username VARCHAR(255),IN firstname VARCHAR(255),IN lastname VARCHAR(255)
		,IN password VARCHAR(255),IN phoneNumber VARCHAR(64),IN email VARCHAR(255), IN active TINYINT(1),IN loginattempts INT(11)
		,IN locale VARCHAR(255), OUT insertId INT(11))
BEGIN
	INSERT INTO users (username, first_name, last_name,password,phone_number,email, active, loginattempts, locale, createdAt, updatedAt)
VALUES (username, firstname, lastname,password, phoneNumber,email, active, loginattempts, locale,UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET insertId = LAST_INSERT_ID(); 
END$$

DELIMITER ;