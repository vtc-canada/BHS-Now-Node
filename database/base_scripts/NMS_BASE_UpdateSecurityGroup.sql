DROP procedure IF EXISTS `NMS_BASE_UpdateSecurityGroup`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateSecurityGroup` (IN paramId INT(11),IN paramName VARCHAR(255))
BEGIN
	UPDATE securitygroups
SET 
	name = paramName,
	updatedAt = UTC_TIMESTAMP()
WHERE
	id = paramId;
END$$

DELIMITER ;

