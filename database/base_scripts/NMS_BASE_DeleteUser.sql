DROP procedure IF EXISTS `NMS_BASE_DeleteUser`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteUser`(IN vuser INT(11))
BEGIN
	DELETE FROM usersecuritygroupmappings
WHERE usersecuritygroupmappings.userId = vuser;
	DELETE FROM users
WHERE id = vuser;
END$$

DELIMITER ;

