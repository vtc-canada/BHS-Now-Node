

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser`(IN vuser INT(11))
BEGIN
	DELETE FROM userssecuritypolicies
WHERE userssecuritypolicies.userId = vuser;
	DELETE FROM users
WHERE id = vuser;
END$$
DELIMITER ;