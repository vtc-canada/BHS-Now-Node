USE `now_management_base`;
DROP procedure IF EXISTS `updateUserActiveLoginAttempts`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `updateUserActiveLoginAttempts` (IN userId INT, IN active TINYINT(1), IN loginattempts INT)
BEGIN
	UPDATE users
SET loginattempts = loginattempts,
active = active,
updatedAt = UTC_TIMESTAMP()
WHERE id = userId;
END$$

DELIMITER ;

