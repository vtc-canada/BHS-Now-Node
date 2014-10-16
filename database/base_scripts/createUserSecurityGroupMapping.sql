USE `now_management_base`;
DROP procedure IF EXISTS `createUserSecurityGroupMapping`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `createUserSecurityGroupMapping` (IN userId INT(11),IN securityGroupId INT(11))
BEGIN
	INSERT INTO usersecuritygroupmappings (userId, securityGroupId, createdAt, updatedAt) VALUES (userId, securityGroupId, UTC_TIMESTAMP(), UTC_TIMESTAMP());
END$$

DELIMITER ;

