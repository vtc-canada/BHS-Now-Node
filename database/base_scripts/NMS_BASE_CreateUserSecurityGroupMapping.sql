DROP procedure IF EXISTS `NMS_BASE_CreateUserSecurityGroupMapping`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateUserSecurityGroupMapping` (IN paramUserId INT(11),IN paramSecurityGroupId INT(11))
BEGIN
	INSERT INTO usersecuritygroupmappings (userId, securityGroupId, createdAt, updatedAt) VALUES (paramUserId, paramSecurityGroupId, UTC_TIMESTAMP(), UTC_TIMESTAMP());
END$$

DELIMITER ;

