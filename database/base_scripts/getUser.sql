USE `now_management_base`;
DROP procedure IF EXISTS `getUser`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUser` (IN userId INT)
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
