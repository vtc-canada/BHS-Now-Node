DROP procedure IF EXISTS `NMS_BASE_DeleteSecurityGroup`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteSecurityGroup`(IN paramSecurityGroupId INT(11))
BEGIN
	DELETE FROM resourcesecuritygroupmappings
WHERE resourcesecuritygroupmappings.securityGroupId = paramSecurityGroupId;
	DELETE FROM securitygroups
WHERE id = paramSecurityGroupId;
END$$

DELIMITER ;

