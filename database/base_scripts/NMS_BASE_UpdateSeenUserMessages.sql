DROP procedure IF EXISTS `NMS_BASE_UpdateSeenUserMessages`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateSeenUserMessages` (IN paramToUserId INT(11),IN paramFromUserId INT(11))
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

