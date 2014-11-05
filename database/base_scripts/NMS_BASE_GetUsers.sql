DROP procedure IF EXISTS `NMS_BASE_GetUsers`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUsers` ()
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

