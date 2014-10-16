USE `now_management_base`;
DROP procedure IF EXISTS `deleteResourceSecurityGroupMappings`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteResourceSecurityGroupMappings`(IN paramSecurityGroupId INT(11))
BEGIN
DELETE FROM resourcesecuritygroupmappings
WHERE 
securityGroupId = paramSecurityGroupId;
END$$

DELIMITER ;