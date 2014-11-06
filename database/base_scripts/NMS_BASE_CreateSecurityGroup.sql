DROP procedure IF EXISTS `NMS_BASE_CreateSecurityGroup`;
DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateSecurityGroup` (IN name VARCHAR(255), OUT createId INT(11))
BEGIN
	INSERT INTO securitygroups (name, createdAt, updatedAt) values (name, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET createId = LAST_INSERT_ID();
END$$

DELIMITER ;

