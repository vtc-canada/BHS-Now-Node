DROP procedure IF EXISTS `NMS_BASE_GetResourceSecurityGroupMappingsCount`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResourceSecurityGroupMappingsCount` ()
BEGIN
	SELECT count(*) AS 'count' FROM resourcesecuritygroupmappings;

END$$

DELIMITER ;

