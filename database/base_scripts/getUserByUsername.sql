USE `now_management_base`;
DROP procedure IF EXISTS `getUserByUsername`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`%` PROCEDURE `getUserByUsername`(IN paramUsername VARCHAR(255))
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

