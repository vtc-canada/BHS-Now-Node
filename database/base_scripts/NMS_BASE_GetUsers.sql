DROP procedure IF EXISTS `NMS_BASE_GetUsers`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUsers` ()
BEGIN
	SELECT id
		,username
		,CONCAT(last_name,', ',first_name) as 'name'
		,phone_number
		,email
		,active
		,loginattempts
		,locale
	FROM
		users;
END$$

DELIMITER ;

