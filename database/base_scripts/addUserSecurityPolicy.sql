DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addUserSecurityPolicy`(IN vUserId INT(11), IN vSecurityGroupId INT(11), OUT id INT)
BEGIN
	INSERT INTO `userssecuritypolicies`(`userId`,`securityGroupId`) 
	VALUES (vUserId, vSecurityGroupId);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;