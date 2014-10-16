USE `now_management_base`;
DROP procedure IF EXISTS `getResourceSecurityGroupMappingsCount`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getResourceSecurityGroupMappingsCount` ()
BEGIN
	SELECT count(*) AS 'count' FROM resourcesecuritygroupmappings;

END$$

DELIMITER ;

