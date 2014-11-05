DROP procedure IF EXISTS `NMS_BASE_GetSecurityGroups`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroups`()
BEGIN
	SELECT * FROM securitygroups; 
END$$

DELIMITER ;

