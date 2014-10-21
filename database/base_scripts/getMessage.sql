USE `now_management_base`;
DROP procedure IF EXISTS `getMessage`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getMessage` (IN paramId INT(11))
BEGIN
	SELECT * 
	FROM messages 
	WHERE id = paramId;
END$$

DELIMITER ;

