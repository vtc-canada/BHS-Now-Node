USE `now_management_base`;
DROP procedure IF EXISTS `getSecurityGroups`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSecurityGroups`()
BEGIN
	SELECT * FROM securitygroups; 
END$$

DELIMITER ;

