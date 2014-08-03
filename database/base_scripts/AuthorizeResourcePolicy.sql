

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AuthorizeResourcePolicy`(IN uid INT(11), IN route VARCHAR(45))
BEGIN
SELECT MAX(resourcessecuritypolicies.create) AS 'create'
, MAX(resourcessecuritypolicies.read) AS 'read'
, MAX(resourcessecuritypolicies.update) AS 'update'
, MAX(resourcessecuritypolicies.delete) AS 'delete'
FROM resourcessecuritypolicies
INNER JOIN resources ON resources.id = resourcessecuritypolicies.resourceId 
INNER JOIN userssecuritypolicies ON userssecuritypolicies.securityGroupId = resourcessecuritypolicies.securityGroupId 
WHERE userssecuritypolicies.userId = uid AND resources.name = route;
END$$
DELIMITER ;