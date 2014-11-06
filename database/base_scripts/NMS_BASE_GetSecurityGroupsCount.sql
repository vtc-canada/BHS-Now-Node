DROP procedure IF EXISTS `NMS_BASE_GetSecurityGroupsCount`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroupsCount` ()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM securitygroups);
END$$

DELIMITER ;

