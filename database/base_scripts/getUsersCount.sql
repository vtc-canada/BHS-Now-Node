USE `now_management_base`;
DROP procedure IF EXISTS `getUsersCount`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUsersCount` ()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM users);
END$$

DELIMITER ;

