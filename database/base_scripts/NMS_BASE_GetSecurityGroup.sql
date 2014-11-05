DROP procedure IF EXISTS `NMS_BASE_GetSecurityGroup`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroup`(IN paramSecurityGroupId INT(11))
BEGIN
	SELECT * FROM securitygroups
WHERE id = paramSecurityGroupId
LIMIT 1; 
END$$

DELIMITER ;

