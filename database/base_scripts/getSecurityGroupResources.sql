USE `now_management_base`;
DROP procedure IF EXISTS `getSecurityGroupResources`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getSecurityGroupResources` (IN paramSecurityGroupId INT(11))
BEGIN
	SELECT 
resources.id
,resources.name
,resourcesecuritygroupmappings.create
,resourcesecuritygroupmappings.read
,resourcesecuritygroupmappings.update
,resourcesecuritygroupmappings.delete
	FROM resourcesecuritygroupmappings
INNER JOIN  
	resources
	ON (resources.id = resourcesecuritygroupmappings.resourceId)
WHERE resourcesecuritygroupmappings.securityGroupId = paramSecurityGroupId;
END$$

DELIMITER ;

