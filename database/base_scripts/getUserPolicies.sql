USE `now_management_base`;
DROP procedure IF EXISTS `getUserPolicies`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUserPolicies` (IN paramUserId INT)
BEGIN
SELECT 
 MAX(resourcesecuritygroupmappings.create) AS 'create'
, MAX(resourcesecuritygroupmappings.read) AS 'read'
, MAX(resourcesecuritygroupmappings.update) AS 'update'
, MAX(resourcesecuritygroupmappings.delete) AS 'delete'
, resources.name
FROM resourcesecuritygroupmappings
INNER JOIN resources ON resources.id = resourcesecuritygroupmappings.resourceId 
INNER JOIN usersecuritygroupmappings ON usersecuritygroupmappings.securityGroupId = resourcesecuritygroupmappings.securityGroupId
WHERE usersecuritygroupmappings.userId = paramUserId GROUP BY resources.name ORDER BY resources.name ;
END$$

DELIMITER ;

