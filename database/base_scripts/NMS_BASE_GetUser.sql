DROP procedure IF EXISTS `NMS_BASE_GetUser`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUser` (IN userId INT)
BEGIN
	SELECT 
		username
		,first_name
		,last_name
		,phone_number
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
