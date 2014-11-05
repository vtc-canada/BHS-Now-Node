DROP procedure IF EXISTS `NMS_BASE_GetResources`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResources` ()
BEGIN
	SELECT 
id,
name,
createdAt,
updatedAt
FROM 
resources;
END$$

DELIMITER ;

