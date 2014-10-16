USE `now_management_base`;
DROP procedure IF EXISTS `getSecurityGroup`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSecurityGroup`(IN paramSecurityGroupId INT(11))
BEGIN
	SELECT * FROM securitygroups
WHERE id = paramSecurityGroupId
LIMIT 1; 
END$$

DELIMITER ;

