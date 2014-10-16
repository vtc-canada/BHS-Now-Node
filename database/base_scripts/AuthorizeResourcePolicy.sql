USE `now_management_base`;
DROP procedure IF EXISTS `AuthorizeResourcePolicy`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AuthorizeResourcePolicy`(IN uid INT(11), IN route VARCHAR(45))
BEGIN
SELECT MAX(resourcesecuritygroupmappings.create) AS 'create'
, MAX(resourcesecuritygroupmappings.read) AS 'read'
, MAX(resourcesecuritygroupmappings.update) AS 'update'
, MAX(resourcesecuritygroupmappings.delete) AS 'delete'
FROM resourcesecuritygroupmappings
INNER JOIN resources ON resources.id = resourcesecuritygroupmappings.resourceId 
INNER JOIN usersecuritygroupmappings ON usersecuritygroupmappings.securityGroupId = resourcesecuritygroupmappings.securityGroupId 
WHERE usersecuritygroupmappings.userId = uid AND resources.name = route;
END$$

DELIMITER ;

