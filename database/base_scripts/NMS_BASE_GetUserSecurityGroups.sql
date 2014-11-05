DROP procedure IF EXISTS `NMS_BASE_GetUserSecurityGroups`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserSecurityGroups` (IN paramUserId INT(11))
BEGIN
SELECT securitygroups.id, securitygroups.name, IF(usersecuritygroupmappings.userId IS NULL,false,true) AS 'member' FROM 
securitygroups
LEFT JOIN
usersecuritygroupmappings ON(securitygroups.id = usersecuritygroupmappings.securityGroupId AND userId = paramUserId)
ORDER BY securitygroups.name ASC;
END$$

DELIMITER ;

