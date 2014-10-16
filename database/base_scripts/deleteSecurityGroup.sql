USE `now_management_base`;
DROP procedure IF EXISTS `deleteSecurityGroup`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteSecurityGroup`(IN paramSecurityGroupId INT(11))
BEGIN
	DELETE FROM resourcesecuritygroupmappings
WHERE resourcesecuritygroupmappings.securityGroupId = paramSecurityGroupId;
	DELETE FROM securitygroups
WHERE id = paramSecurityGroupId;
END$$

DELIMITER ;

