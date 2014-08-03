

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSecurityGroups`()
BEGIN
	SELECT * FROM securitygroups;
END$$
DELIMITER ;