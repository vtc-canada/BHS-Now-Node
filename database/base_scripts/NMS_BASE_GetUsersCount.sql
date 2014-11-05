DROP procedure IF EXISTS `NMS_BASE_GetUsersCount`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUsersCount` ()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM users);
END$$

DELIMITER ;

