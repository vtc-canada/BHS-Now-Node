DROP procedure IF EXISTS `NMS_BASE_GetUserSecurityGroupMappingsCount`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserSecurityGroupMappingsCount` ()
BEGIN
	SELECT count(*) AS 'count' FROM usersecuritygroupmappings;

END$$

DELIMITER ;

