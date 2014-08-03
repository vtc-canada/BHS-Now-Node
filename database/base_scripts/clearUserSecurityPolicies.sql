

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `clearUserSecurityPolicies`(IN vuserid INT(11))
BEGIN
	DELETE FROM userssecuritypolicies
WHERE userId = vuserid;
END$$
DELIMITER ;