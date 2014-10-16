USE `now_management_base`;
DROP procedure IF EXISTS `deleteUser`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser`(IN vuser INT(11))
BEGIN
	DELETE FROM usersecuritygroupmappings
WHERE usersecuritygroupmappings.userId = vuser;
	DELETE FROM users
WHERE id = vuser;
END$$

DELIMITER ;

