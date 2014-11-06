DROP procedure IF EXISTS `NMS_BASE_DeleteResourceSecurityGroupMappings`;
DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteResourceSecurityGroupMappings`(IN paramSecurityGroupId INT(11))
BEGIN
DELETE FROM resourcesecuritygroupmappings
WHERE 
securityGroupId = paramSecurityGroupId;
END$$

DELIMITER ;