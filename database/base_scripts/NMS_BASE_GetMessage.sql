DROP procedure IF EXISTS `NMS_BASE_GetMessage`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetMessage` (IN paramId INT(11))
BEGIN
	SELECT * 
	FROM messages 
	WHERE id = paramId;
END$$

DELIMITER ;

