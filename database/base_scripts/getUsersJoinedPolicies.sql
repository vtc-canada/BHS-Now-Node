

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getUsersJoinedPolicies`()
BEGIN
	SELECT users.id
		,users.username
		,MAX(CASE securityGroups.name  WHEN 'Administrator' THEN 1 ELSE 0 END) as 'Administrator'
		,MAX(CASE securityGroups.name  WHEN 'Anonymous' THEN 1 ELSE 0 END) as 'Anonymous'
	FROM users
		INNER JOIN userssecuritypolicies ON (userssecuritypolicies.userId = users.id)
		INNER JOIN securitygroups ON (securitygroups.id = userssecuritypolicies.securityGroupId);
END$$
DELIMITER ;
