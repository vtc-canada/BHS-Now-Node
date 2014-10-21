USE `now_management_base`;
DROP procedure IF EXISTS `updateSeenUserMessages`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `updateSeenUserMessages` (IN paramToUserId INT(11),IN paramFromUserId INT(11))
BEGIN

UPDATE messages
SET seen = 1,
updatedAt = UTC_TIMESTAMP()
WHERE
	toUserId = paramToUserId
AND
	fromUserId = paramFromUserId;
END$$

DELIMITER ;

