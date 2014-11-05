DROP procedure IF EXISTS `NMS_BASE_UpdateUserActiveLoginAttempts`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateUserActiveLoginAttempts` (IN userId INT, IN active TINYINT(1), IN loginattempts INT)
BEGIN
	UPDATE users
SET loginattempts = loginattempts,
active = active,
updatedAt = UTC_TIMESTAMP()
WHERE id = userId;
END$$

DELIMITER ;

