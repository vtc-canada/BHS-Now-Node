USE `now_management_base`;
DROP procedure IF EXISTS `getUserSecurityGroupMappingsCount`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUserSecurityGroupMappingsCount` ()
BEGIN
	SELECT count(*) AS 'count' FROM usersecuritygroupmappings;

END$$

DELIMITER ;

