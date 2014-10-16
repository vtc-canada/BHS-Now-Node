USE `now_management_base`;
DROP procedure IF EXISTS `getUsers`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUsers` ()
BEGIN
	SELECT
id
,username
,email
,active
,loginattempts
,locale
	FROM
users;
END$$

DELIMITER ;

