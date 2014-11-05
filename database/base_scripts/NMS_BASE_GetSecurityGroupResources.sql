DROP procedure IF EXISTS `NMS_BASE_GetSecurityGroupResources`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroupResources` (IN paramSecurityGroupId INT(11))
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

