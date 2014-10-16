USE `now_management_base`;
DROP procedure IF EXISTS `getResources`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getResources` ()
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

