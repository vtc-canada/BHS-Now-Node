USE `now_management_base`;
DROP procedure IF EXISTS `deleteUserSecurityGroupMappings`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteUserSecurityGroupMappings`(IN paramUserId INT(11))
BEGIN
DELETE FROM usersecuritygroupmappings
WHERE 
userId = paramUserId;
END$$

DELIMITER ;