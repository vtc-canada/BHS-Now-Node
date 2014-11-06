DROP procedure IF EXISTS `NMS_BASE_GetUserByUsername`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserByUsername`(IN paramUsername VARCHAR(255))
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
username = paramUsername
LIMIT 1;

END$$

DELIMITER ;

