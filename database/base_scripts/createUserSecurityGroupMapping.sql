USE `now_management_base`;
DROP procedure IF EXISTS `createUserSecurityGroupMapping`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `createUserSecurityGroupMapping` (IN paramUserId INT(11),IN paramSecurityGroupId INT(11))
BEGIN
	INSERT INTO usersecuritygroupmappings (userId, securityGroupId, createdAt, updatedAt) VALUES (paramUserId, paramSecurityGroupId, UTC_TIMESTAMP(), UTC_TIMESTAMP());
END$$

DELIMITER ;

