DROP procedure IF EXISTS `NMS_BASE_GetUser`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUser` (IN userId INT)
BEGIN
	SELECT 
		username
		,password
		,email
		,active
		,loginattempts
		,locale
		,id
		,createdAt
		,updatedAt 
FROM users
WHERE
id = userId
LIMIT 1;
END$$

DELIMITER ;
