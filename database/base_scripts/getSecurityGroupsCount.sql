USE `now_management_base`;
DROP procedure IF EXISTS `getSecurityGroupsCount`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getSecurityGroupsCount` ()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM securitygroups);
END$$

DELIMITER ;

