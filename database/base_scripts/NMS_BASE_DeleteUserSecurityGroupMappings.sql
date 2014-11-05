DROP procedure IF EXISTS `NMS_BASE_DeleteUserSecurityGroupMappings`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteUserSecurityGroupMappings`(IN paramUserId INT(11))
BEGIN
DELETE FROM usersecuritygroupmappings
WHERE 
userId = paramUserId;
END$$

DELIMITER ;