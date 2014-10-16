USE `now_management_base`;
DROP procedure IF EXISTS `getResourcesCount`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getResourcesCount` ()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM resources);
END$$

DELIMITER ;

