USE `now_management_base`;
DROP procedure IF EXISTS `getUserSecurityGroups`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUserSecurityGroups` (IN paramUserId INT(11))
BEGIN
SELECT securitygroups.id, securitygroups.name, IF(usersecuritygroupmappings.userId IS NULL,false,true) AS 'member' FROM 
securitygroups
LEFT JOIN
usersecuritygroupmappings ON(securitygroups.id = usersecuritygroupmappings.securityGroupId AND userId = paramUserId);
END$$

DELIMITER ;

