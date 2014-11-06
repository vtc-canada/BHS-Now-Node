DROP procedure IF EXISTS `NMS_BASE_GetResourcesCount`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResourcesCount` ()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM resources);
END$$

DELIMITER ;

