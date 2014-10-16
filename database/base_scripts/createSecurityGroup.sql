USE `now_management_base`;
DROP procedure IF EXISTS `createSecurityGroup`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `createSecurityGroup` (IN name VARCHAR(255), OUT createId INT(11))
BEGIN
	INSERT INTO securitygroups (name, createdAt, updatedAt) values (name, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET createId = LAST_INSERT_ID();
END$$

DELIMITER ;

