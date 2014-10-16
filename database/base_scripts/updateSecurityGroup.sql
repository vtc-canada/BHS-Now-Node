USE `now_management_base`;
DROP procedure IF EXISTS `updateSecurityGroup`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `updateSecurityGroup` (IN paramId INT(11),IN paramName VARCHAR(255))
BEGIN
	UPDATE securitygroups
SET 
	name = paramName,
	updatedAt = UTC_TIMESTAMP()
WHERE
	id = paramId;
END$$

DELIMITER ;

