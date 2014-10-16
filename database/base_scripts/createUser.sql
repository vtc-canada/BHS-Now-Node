USE `now_management_base`;
DROP procedure IF EXISTS `createUser`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`%` PROCEDURE `createUser`(IN username VARCHAR(255),IN password VARCHAR(255),IN email VARCHAR(255), IN active TINYINT(1),IN loginattempts INT(11),IN locale VARCHAR(255), OUT insertId INT(11))
BEGIN
	INSERT INTO users (username, password, email, active, loginattempts, locale, createdAt, updatedAt)
VALUES (username, password, email, active, loginattempts, locale,UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET insertId = LAST_INSERT_ID(); 
END$$

DELIMITER ;